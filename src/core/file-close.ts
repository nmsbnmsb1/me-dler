import fs from 'fs';
import { Action } from 'me-actions';
import { IDLContext } from '../context';
import { e } from '../utils';

export default class extends Action {
	protected async doStart(context: IDLContext) {
		let { metaData } = context;
		//
		let isCompleted = true;
		for (let thread of metaData.threads) {
			if (thread.position < thread.end) {
				isCompleted = false;
				break;
			}
		}
		if (!isCompleted) throw e(1013);
		//
		fs.ftruncateSync(metaData.dlDescriptor, metaData.fileSize);
		fs.closeSync(metaData.dlDescriptor);
		fs.renameSync(metaData.dlFile, context.file);
	}
}
