import fs from 'fs';
import { Action } from 'me-actions';
import { IDLContext } from '../context';

export function writeMeta(context: IDLContext) {
	let { runtime } = context;
	//
	try {
		let meta = {
			fileSize: runtime.fileSize,
			url: runtime.url,
			//headers: runtime.headers,
			threads: runtime.threads,
		};
		//
		let buffer = Buffer.alloc(context.metaSize);
		buffer.fill(' ');
		let dataString = JSON.stringify(meta);
		buffer.write(dataString);
		let writePosition = runtime.fileSize;
		fs.writeSync(runtime.fileDescriptor, buffer, 0, buffer.length, writePosition);
		//
	} catch (err) {
		throw err;
	}
}

export default class extends Action {
	protected async doStart(context: IDLContext) {
		writeMeta(context);
	}
}
