import fs from 'node:fs';

import { Action } from 'me-actions';

import type { DLContext } from '../context';
import { e } from '../utils';

export default class extends Action {
	protected async doStart(context: DLContext) {
		let { metaData } = context;
		metaData.status = 'invalid';
		//
		let stats = fs.fstatSync(metaData.dlDescriptor);
		let actualSize = stats.size;
		if (actualSize < context.metaSize) {
			context.logger?.(
				'debug',
				`Metadata read failed: file size (${actualSize}) is smaller than required metadata size (${context.metaSize})`,
				this,
				this.context
			);
			return;
		}
		//
		try {
			let readPostion = actualSize - context.metaSize;
			let buffer = Buffer.alloc(context.metaSize);
			fs.readSync(metaData.dlDescriptor, buffer, 0, buffer.length, readPostion);
			let meta = JSON.parse(buffer.toString());
			//
			metaData.status = undefined;
			metaData.ddxc = meta.ddxc;
			metaData.url = meta.url;
			metaData.fileSize = meta.fileSize;
			metaData.threads = meta.threads;
			//如果不支持断点续传,重置参数
			if (!meta.ddxc) {
				metaData.fileSize = 0;
				if (metaData.threads?.[0]) {
					metaData.threads[0].start = metaData.threads[0].end = metaData.threads[0].position = 0;
					metaData.threads[0].done = false;
				}
			}
			context.logger?.('debug', `MetaData readed: ${JSON.stringify(metaData)}`, this, this.context);
		} catch (err) {
			//throw e(context, 'read_meta_failed', metaData.dlFile);
			context.logger?.('error', `MetaData could not be readed on path: ${context.file}`, this, this.context);
		}
	}
}
