import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { Action } from 'me-actions';

import type { DLContext } from '../context';
import { e, isExists } from '../utils';

export default class extends Action {
	protected async doStart(context: DLContext) {
		let { metaData } = context;
		//如果强制overwrite，则删除可能存在的dlFile
		let existsDLFile = await isExists(metaData.dlFile);
		if (existsDLFile && (context.overwrite === 'all' || context.overwrite === 'dl')) {
			//如果存在dlFile,则删除
			context.logger?.('debug', `Delete .dl file at ${metaData.dlFile}`, this, this.context);
			await fsPromises.rm(metaData.dlFile);
			existsDLFile = false;
		}
		let existsErrFile = await isExists(metaData.errFile);
		if (existsErrFile) {
			context.logger?.('debug', `Delete .err file at ${metaData.errFile}`, this, this.context);
			await fsPromises.rm(metaData.errFile);
			existsErrFile = false;
		}
		//创建父级文件夹
		if (context.mkdir) {
			await fsPromises.mkdir(path.dirname(metaData.dlFile), { recursive: true });
		}
		//获得dlFile的文件句柄
		try {
			context.logger?.('debug', `Open .dl file at ${metaData.dlFile}`, this, this.context);
			metaData.dlHandle = await fsPromises.open(metaData.dlFile, !existsDLFile ? 'w+' : 'r+');
		} catch (err) {
			throw e(context, 'file_failed', metaData.dlFile);
		}
	}
}
