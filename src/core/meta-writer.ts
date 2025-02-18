import fs from 'node:fs';

import { Action } from 'me-actions';

import type { DLContext } from '../context';
import { e } from '../utils';

export function writeMeta(context: DLContext) {
	let { metaData } = context;
	//
	try {
		let meta = {
			ddxc: metaData.ddxc,
			url: metaData.url,
			fileSize: metaData.fileSize,
			threads: metaData.threads,
		};
		//
		let buffer = Buffer.alloc(context.metaSize);
		buffer.fill(' ');
		let dataString = JSON.stringify(meta);
		buffer.write(dataString);
		let writePosition = metaData.fileSize;
		fs.writeSync(metaData.dlDescriptor, buffer, 0, buffer.length, writePosition);
		//
	} catch (err) {
		throw e(context, 'write_meta_failed', metaData.dlFile);
	}
}

export default class extends Action {
	protected async doStart(context: DLContext) {
		return writeMeta(context);
	}
}
