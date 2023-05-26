import fs from 'fs';
import { Action } from 'me-actions';
import { IDLContext } from '../context';
import { e } from '../utils';

export default class extends Action {
	protected async doStart(context: IDLContext) {
		let { runtime } = context;
		//
		let isCompleted = true;
		for (let thread of runtime.threads) {
			if (thread.position < thread.end) {
				isCompleted = false;
				break;
			}
		}
		if (!isCompleted) throw e(1013);
		//
		fs.ftruncateSync(runtime.fileDescriptor, runtime.fileSize);
		fs.closeSync(runtime.fileDescriptor);
		fs.renameSync(context.mtdfile, context.file);
	}
}
