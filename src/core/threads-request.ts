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

	constructor(thread: IThread) {
		super();
		this.thread = thread;
	}

	protected async doStart(context: IDLContext) {
		let { runtime } = context;
		let headers = JSON.parse(JSON.stringify(context.headers || {}));
		headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
		//
		try {
			this.response = await request({ method: context.method, url: runtime.url, headers, timeout: context.timeout, responseType: 'stream' });
			//
			this.onData = (chunk: any) => {
				if (!this.isPending()) return;
				//
				try {
					fs.writeSync(runtime.fileDescriptor, chunk, 0, chunk.length, this.thread.position);
					this.thread.position += chunk.length;
					if (this.thread.position > this.thread.end) this.thread.position = this.thread.end;
					writeMeta(context);
					if (this.thread.position >= this.thread.end) this.getRP().resolve();
				} catch (err) {
					this.getRP().reject(err);
				}
			};
			this.response.data.on('data', this.onData);
			//
		} catch (err) {
			throw e(1004, `${err}: ${context.url}`);
		}
		//
		await this.getRP().p;
	}

	protected doStop() {
		this.response?.data?.off('data', this.onData);
		this.endRP();
	}
}
