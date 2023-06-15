import fs from 'fs';
import { Action } from 'me-actions';
import { IDLContext } from '../context';

export default class extends Action {
	protected async doStart(context: IDLContext) {
		let { metaData } = context;
		//如果有任何错误
		if (context.writeErrFile && context.errs.length > 0) {
			let errs = [];
			for (let err of context.errs) errs.push(...err.stack.split('\n'));
			//
			fs.writeFileSync(
				metaData.errFile,
				JSON.stringify({ url: context.url, errs }, undefined, 4),
				{ mode: 0o777 } //
			);
		}
		//
		if (!metaData.dlDescriptor) return;
		//
		let hasDown = true;
		if (!metaData.threads || metaData.threads.length <= 0) {
			hasDown = false;
		} else {
			for (let thread of metaData.threads) {
				if (!thread.done) {
					hasDown = false;
					break;
				}
			}
		}
		//
		if (!hasDown) {
			context.hasDown = false;
			//获取文件size
			let size = fs.fstatSync(metaData.dlDescriptor).size;
			//如果size和metaSize相同，相当于没有下载
			if (size <= context.metaSize) {
				fs.closeSync(metaData.dlDescriptor);
				fs.unlinkSync(metaData.dlFile);
			} else {
				fs.closeSync(metaData.dlDescriptor);
			}
		} else {
			context.hasDown = true;
			//
			fs.ftruncateSync(metaData.dlDescriptor, metaData.fileSize);
			fs.closeSync(metaData.dlDescriptor);
			fs.renameSync(metaData.dlFile, context.file);
		}
	}
}
