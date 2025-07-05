import fsPromises from 'node:fs/promises';

import { Action } from 'me-actions';

import type { DLContext } from '../context';

export default class extends Action {
	protected async doStart(context: DLContext) {
		let { metaData } = context;
		if (metaData.dlHandle) {
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
			if (!hasDown) {
				context.hasDown = false;
				//获取文件size
				// let size = 0;
				// try {
				// 	size = (await metaData.dlHandle.stat()).size;
				// } catch (e) {
				// 	context.errs.push(e);
				// }
				//如果size和metaSize相同，相当于没有下载
				try {
					// if (size <= context.metaSize) {
					// 	await metaData.dlHandle.close();
					// 	await fsPromises.rm(metaData.dlFile);
					// } else {
					// 	await metaData.dlHandle.close();
					// }
					await metaData.dlHandle.close();
				} catch (e) {
					context.errs.push(e);
				}
				context.logger?.('verbose', `File hasn't been downloaded.`, this, this.context);
			} else {
				context.hasDown = true;
				//
				await metaData.dlHandle.truncate(metaData.fileSize);
				await metaData.dlHandle.close();
				//
				// await new Promise((resolve) => setTimeout(resolve, 1000));
				// fs.renameSync(metaData.dlFile, context.file);
				//
				// let maxRetries = 3;
				// let e: any;
				// for (let i = 0; i < maxRetries; i++) {
				// 	try {
				// 		await fsPromises.rename(metaData.dlFile, context.file);
				// 		context.logger?.('verbose', `File has been saved to ${context.file}`, this, this.context);
				// 		return;
				// 	} catch (err) {
				// 		if (i < maxRetries - 1) {
				// 			await new Promise((resolve) => setTimeout(resolve, 1000));
				// 		} else {
				// 			e = err;
				// 			break;
				// 		}
				// 	}
				// }
				// if (e) {
				// 	context.errs.push(e);
				// }
				await fsPromises.rename(metaData.dlFile, context.file);
			}
		}
		//如果有任何错误
		if (context.writeErrFile && context.errs.length > 0) {
			let errs = [];
			for (let err of context.errs) errs.push([...err.stack.split('\n')]);
			//
			try {
				await fsPromises.writeFile(metaData.errFile, JSON.stringify({ url: context.url, errs }, undefined, 4), {
					mode: 0o777,
				});
			} catch (e) {
				context.logger?.('error', `Couldnot write err file at ${metaData.errFile}`, this, this.context);
			}
		}
	}
}
