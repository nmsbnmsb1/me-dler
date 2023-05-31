import fs from 'fs';
import { AxiosResponse } from 'axios';
import { Action } from 'me-actions';
import { IDLContext, IThread } from '../context';
import { e, request } from '../utils';
import { writeMeta } from './meta-writer';

export default class extends Action {
	private thread: IThread;
	private response: AxiosResponse;
	private onData: any;
	private onEnd: any;

	constructor(thread: IThread) {
		super();
		this.thread = thread;
	}

	protected async doStart(context: IDLContext) {
		let { metaData } = context;
		let headers = context.headers ? JSON.parse(JSON.stringify(context.headers)) : {};
		if (!metaData.ddxc) {
			headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
		}
		//
		try {
			this.response = await request({
				method: context.method,
				url: metaData.url,
				headers,
				timeout: context.timeout,
				responseType: 'stream',
			});
			//
			this.onData = (chunk: any) => {
				if (!this.isPending()) return;
				//
				try {
					fs.writeSync(metaData.dlDescriptor, chunk, 0, chunk.length, this.thread.position);
					this.thread.position += chunk.length;
					//如果不支持断点续传
					if (!metaData.ddxc) {
						//每次都假设完成
						metaData.fileSize = this.thread.end = this.thread.position;
						//
					} else {
						if (this.thread.position > this.thread.end) {
							this.thread.position = this.thread.end;
						}
					}
					//
					writeMeta(context);
					//
				} catch (err) {
					this.getRP().reject(err);
				}
			};
			this.response.data.on('data', this.onData);
			//
			this.onEnd = () => {
				this.getRP().resolve();
			};
			this.response.data.on('end', this.onEnd);
			//
		} catch (err) {
			throw e(1002, `${err}: ${context.url}`);
		}
		//
		await this.getRP().p;
	}

	protected doStop() {
		this.response?.data?.off('data', this.onData);
		this.response?.data?.off('end', this.onEnd);
		this.endRP();
	}
}
