import fs from 'fs';
import { AxiosResponse } from 'axios';
import { Action } from 'me-actions';
import { IDLContext, IThread } from '../context';
import { e, request } from '../utils';
import { writeMeta } from './meta-writer';

export default class extends Action {
	private thread: IThread;
	private response: AxiosResponse;
	private lnMap: any;

	constructor(thread: IThread) {
		super();
		this.thread = thread;
		this.lnMap = {};
	}

	protected async doStart(context: IDLContext) {
		let { metaData } = context;
		let headers = context.headers ? JSON.parse(JSON.stringify(context.headers)) : {};
		if (metaData.ddxc) headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
		//
		//创建链接
		{
			try {
				this.response = await request({ method: context.method, url: metaData.url, headers, timeout: context.timeout, responseType: 'stream' });
			} catch (err) {
				throw e(1002, err.message, `${context.method.toUpperCase()}: ${metaData.url}`);
			}
		}
		//流式传输
		{
			this.lnMap.data = (chunk: any) => {
				if (!this.isPending()) return;
				//
				try {
					fs.writeSync(metaData.dlDescriptor, chunk, 0, chunk.length, this.thread.position);
					this.thread.position += chunk.length;
					//如果不支持断点续传
					if (!metaData.ddxc) {
						//每次都假设完成
						metaData.fileSize = this.thread.end = this.thread.position;
					} else {
						if (this.thread.position > this.thread.end) {
							this.thread.position = this.thread.end;
						}
					}
					writeMeta(context);
					//
				} catch (err) {
					this.getRP().reject(err);
				}
			};
			this.lnMap.error = (err: Error) => {
				this.getRP().reject(err);
			};
			this.lnMap.end = () => {
				this.getRP().resolve();
			};
			for (let k in this.lnMap) {
				this.response.data.on(k, this.lnMap[k]);
			}
		}
		//侦听
		let err;
		{
			try {
				await this.getRP().p;
			} catch (e) {
				err = e;
			}
		}
		//断开连接
		{
			for (let k in this.lnMap) {
				this.response?.data?.off(k, this.lnMap[k]);
			}
		}
		//
		this.thread.done = err === undefined;
		writeMeta(context);
		if (err) throw err;
	}

	protected doStop() {
		for (let k in this.lnMap) {
			this.response?.data?.off(k, this.lnMap[k]);
		}
	}
}
