import fs from 'node:fs';
import path from 'node:path';

import { Action } from 'me-actions';

import type { DLContext } from '../context';
import { e, fsPromisify } from '../utils';

export default class extends Action {
	protected async doStart(context: DLContext) {
		let { metaData } = context;
		//如果要重新下载，则删除原文件
		if (context.overwrite === 'all' && (await fsPromisify(fs.exists, context.file))) {
			context.logger?.('debug', `Delete file at ${context.file} as overwrite setted.`, this, this.context);
			await fsPromisify(fs.unlink, context.file);
		}
		//如果强制overwrite，则删除可能存在的dlFile
		let existsDLFile = await fsPromisify(fs.exists, metaData.dlFile);
		if ((context.overwrite === 'all' || context.overwrite === 'dl') && existsDLFile) {
			//如果存在dlFile,则删除
			context.logger?.('debug', `Delete .dl file at ${metaData.dlFile}`, this, this.context);
			await fsPromisify(fs.unlink, metaData.dlFile);
			existsDLFile = false;
		}
		if (await fsPromisify(fs.exists, metaData.errFile)) {
			context.logger?.('debug', `Delete .err file at ${metaData.errFile}`, this, this.context);
			await fsPromisify(fs.unlink, metaData.errFile);
		}
		//
		//创建父级文件夹
		if (context.mkdir) {
			//获取dlFile的父级文件夹
			let dir = path.dirname(metaData.dlFile);
			//如果不存在则创建
			if (!(await fsPromisify(fs.exists, dir))) await fsPromisify(fs.mkdir, dir);
		}
		//获得dlFile的文件句柄
		try {
			context.logger?.('debug', `Open .dl file at ${metaData.dlFile}`, this, this.context);
			metaData.dlDescriptor = await fsPromisify(fs.open, metaData.dlFile, !existsDLFile ? 'w+' : 'r+', undefined);
		} catch (err) {
			throw e(context, 'file_failed', metaData.dlFile);
		}
	}
}
