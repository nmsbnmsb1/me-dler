import fs from 'node:fs';

import type { AxiosResponse } from 'axios';
import { Action } from 'me-actions';

import type { DLContext, DLThread } from '../context';
import { e, request } from '../utils';
import { writeMeta } from './meta-writer';

export default class extends Action {
	private thread: DLThread;
	private response: AxiosResponse;
	private lnMap: any;

	constructor(thread: DLThread) {
		super();
		this.thread = thread;
		this.lnMap = {};
	}

	protected async doStart(context: DLContext) {
		let { metaData } = context;
		let headers = context.headers ? JSON.parse(JSON.stringify(context.headers)) : {};
		if (metaData.ddxc) headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
		//创建链接
		try {
			this.response = await request(context, {
				method: context.method,
				url: metaData.url,
				headers,
				timeout: context.timeout,
				responseType: 'stream',
			});
		} catch (err) {
			throw e(context, 'data_failed', err.message, `${context.method.toUpperCase()}: ${metaData.url}`);
		}
		//流式传输
		let rp = this.getRP();
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
					rp.reject(e(context, 'write_data_failed', this.thread.seq, metaData.dlFile));
				}
			};
			this.lnMap.error = (err: Error) => {
				rp.reject(e(context, 'data_failed', err.message, `${context.method.toUpperCase()}: ${metaData.url}`));
			};
			this.lnMap.end = () => {
				rp.resolve();
			};
			for (let k in this.lnMap) {
				this.response.data.on(k, this.lnMap[k]);
			}
		}
		//侦听
		let err: any;
		try {
			await rp.p;
		} catch (e) {
			err = e;
		}
		//断开连接
		for (let k in this.lnMap) {
			this.response?.data?.off(k, this.lnMap[k]);
		}
		//
		this.thread.done = err === undefined;
		writeMeta(context);
		if (err) throw err;
	}

	protected async doStop() {
		for (let k in this.lnMap) {
			this.response?.data?.off(k, this.lnMap[k]);
		}
	}
}
