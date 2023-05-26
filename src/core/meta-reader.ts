import fs from 'fs';
import { Action } from 'me-actions';
import { IDLContext } from '../context';

export default class extends Action {
	protected async doStart(context: IDLContext) {
		let { runtime } = context;
		try {
			let stats = fs.fstatSync(runtime.fileDescriptor);
			let actualSize = stats.size;
			let readPostion = actualSize - context.metaSize;
			let buffer = Buffer.alloc(context.metaSize);
			fs.readSync(runtime.fileDescriptor, buffer, 0, buffer.length, readPostion);
			//
			let meta = JSON.parse(buffer.toString());
			runtime.fileSize = meta.fileSize;
			runtime.url = meta.url;
			//runtime.url_object = url.parse(meta.url);
			//runtime.headers = meta.headers;
			runtime.threads = meta.threads;
			//
		} catch (err) {
			throw err;
		}
	}
}
