import fs from 'fs';
import { AxiosResponse } from 'axios';
import { Action } from 'me-actions';
import { IDLContext, IThread } from '../context';
import { request } from '../http';
import e from '../errs';
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
		let { dl } = context;
		let { results } = dl;
		let headers = JSON.parse(JSON.stringify(dl.headers || {}));
		headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
		//
		try {
			this.response = await request({ method: dl.method, url: results.url, headers, timeout: dl.timeout, responseType: 'stream' });
			//
			this.onData = (chunk: any) => {
				if (!this.isPending()) return;
				//
				try {
					fs.writeSync(results.fd, chunk, 0, chunk.length, this.thread.position);
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
			throw e(1004, `${err}: ${dl.url}`);
		}
		//
		await this.getRP().p;
	}

	protected doStop() {
		this.response?.data?.off('data', this.onData);
		this.endRP();
	}
}
