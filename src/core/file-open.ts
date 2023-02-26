import path from 'path';
import fs from 'fs';
import { Action } from 'me-actions';
import { IDLContext } from '../context';
import e from '../errs';

export default class extends Action {
	protected async doStart({ dl }: IDLContext) {
		//创建父级文件夹
		if (dl.mkdir && !fs.existsSync(path.dirname(dl.mtdfile))) fs.mkdirSync(path.dirname(dl.mtdfile));
		//
		try {
			dl.results.fd = fs.openSync(dl.mtdfile, !fs.existsSync(dl.mtdfile) ? 'w+' : 'r+', undefined);
		} catch (err) {
			throw e(1007, dl.mtdfile);
		}
	}
}
