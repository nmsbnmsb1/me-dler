import fs from 'fs';
import path from 'path';
import { Action } from 'me-actions';
import { IDLContext } from '../context';
import { e } from '../utils';

export default class extends Action {
	protected async doStart(context: IDLContext) {
		let { metaData } = context;
		//如果强制overwrite，则删除可能存在的dlFile
		let existsDLFile = fs.existsSync(metaData.dlFile);
		if (context.overwrite) {
			//如果存在dlFile,则删除
			if (existsDLFile) {
				fs.unlinkSync(metaData.dlFile);
				existsDLFile = false;
			}
		}
		if (fs.existsSync(metaData.errFile)) {
			fs.unlinkSync(metaData.errFile);
		}
		//
		//创建父级文件夹
		if (context.mkdir) {
			//获取dlFile的父级文件夹
			let dir = path.dirname(metaData.dlFile);
			//如果不存在则创建
			if (!fs.existsSync(dir)) fs.mkdirSync(dir);
		}
		//获得dlFile的文件句柄
		try {
			metaData.dlDescriptor = fs.openSync(metaData.dlFile, !existsDLFile ? 'w+' : 'r+', undefined);
		} catch (err) {
			throw e('file_failed', metaData.dlFile);
		}
	}
}
