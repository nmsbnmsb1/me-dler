import fs from 'fs';
import { Action } from 'me-actions';
import { IDLContext } from '../context';

export function writeMeta({ dl }: IDLContext) {
	let { results } = dl;
	try {
		let meta = {
			fileSize: results.fileSize,
			url: results.url,
			//headers: results.headers,
			threads: results.threads,
		};
		//
		let buffer = Buffer.alloc(dl.metaSize);
		buffer.fill(' ');
		let dataString = JSON.stringify(meta);
		buffer.write(dataString);
		let writePosition = results.fileSize;
		fs.writeSync(results.fd, buffer, 0, buffer.length, writePosition);
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
