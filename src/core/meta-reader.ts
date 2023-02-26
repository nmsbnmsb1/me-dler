import fs from 'fs';
import { Action } from 'me-actions';
import { IDLContext } from '../context';

export default class extends Action {
	protected async doStart({ dl }: IDLContext) {
		let { results } = dl;
		try {
			let stats = fs.fstatSync(results.fd);
			let actualSize = stats.size;
			let readPostion = actualSize - dl.metaSize;
			let buffer = Buffer.alloc(dl.metaSize);
			fs.readSync(results.fd, buffer, 0, buffer.length, readPostion);
			//
			let meta = JSON.parse(buffer.toString());
			results.fileSize = meta.fileSize;
			results.url = meta.url;
			//results.url_object = url.parse(meta.url);
			//results.headers = meta.headers;
			results.threads = meta.threads;
			//
		} catch (err) {
			throw err;
		}
	}
}
