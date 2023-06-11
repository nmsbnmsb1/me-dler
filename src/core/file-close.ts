import fs from 'fs';
import { Action } from 'me-actions';
import { IDLContext } from '../context';
import { e } from '../utils';

export default class extends Action {
	protected async doStart(context: IDLContext) {
		let { metaData } = context;
		//
		if (!metaData.dlDescriptor) return;
		//
		let completed = true;
		if (metaData.threads && metaData.threads.length > 0) {
			for (let thread of metaData.threads) {
				if (thread.end === 0 || thread.position < thread.end) {
					completed = false;
					break;
				}
			}
		} else {
			completed = false;
		}
		//
		if (!completed) {
			if (fs.fstatSync(metaData.dlDescriptor).size <= 0) {
				fs.closeSync(metaData.dlDescriptor);
				fs.unlinkSync(metaData.dlFile);
			} else {
				fs.closeSync(metaData.dlDescriptor);
			}
		} else {
			fs.ftruncateSync(metaData.dlDescriptor, metaData.fileSize);
			fs.closeSync(metaData.dlDescriptor);
			fs.renameSync(metaData.dlFile, context.file);
		}
	}
}
