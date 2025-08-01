import fsPromises from 'node:fs/promises';
import { ActionForFunc, ErrHandler, RunOne } from 'me-actions';

import type { DLContext } from './context';
import { e, isExists } from './utils';

import DataRequest from './core/data-request';
import FileClose from './core/file-close';
import FileOpen from './core/file-open';
import HeadRequest from './core/head-request';
import InitContext from './core/init-context';
import MetaReader from './core/meta-reader';
import MetaWriter from './core/meta-writer';
import ThreadsGenerator from './core/threads-generator';

export class Downloader extends RunOne {
	protected context: DLContext;

	constructor(context: DLContext) {
		super(ErrHandler.RejectImmediately);
		this.context = context;
	}

	// protected override logErr() {
	// 	super.logErr();
	// 	if (this.context.writeErrFile === false || !this.context.metaData) return;
	// 	//
	// 	let { errFile } = this.context.metaData;
	// 	let errorContent = {
	// 		timestamp: new Date().toISOString(),
	// 		context: this.context,
	// 		error: { name: this.error.name, message: this.error.message, stack: this.error.stack },
	// 	};
	// 	try {
	// 		fs.writeFileSync(errFile, JSON.stringify(errorContent, null, 2), 'utf-8');
	// 		// if (this.context.logger) {
	// 		// 	this.context.logger('error', `Download failed. Error details written to ${errFile}`, this, this.context);
	// 		// }
	// 	} catch (writeErr) {
	// 		// if (this.context.logger) {
	// 		// 	this.context.logger('error', `Failed to write error file: ${writeErr.message}`, this, this.context);
	// 		// }
	// 	}
	// }

	protected async doStart(context: DLContext) {
		//如果有预载脚本，则预载
		if (context.preloader) {
			try {
				context.logger?.('verbose', 'Preloader File', this, this.context);
				await context.preloader(this, context);
			} catch (err) {
				throw e(context, 'preload_failed', err);
			}
		}
		if (!context.url) throw e(context, 'no_url');
		if (!context.file) throw e(context, 'no_file');
		if (await isExists(context.file)) {
			if (context.overwrite !== 'all') {
				context.logger?.('warn', `File exists ${context.file}`, this, this.context);
				return;
			}
			//
			context.logger?.('debug', `Delete file at ${context.file} as overwrite setted.`, this, this.context);
			await fsPromises.rm(context.file);
		}
		//开启下载进程
		context.logger?.('verbose', `Start download ${context.url} to ${context.file}`, this, this.context);
		//初始化context
		this.addChild(new InitContext());
		//准备要下载的文件;
		this.addChild(new FileOpen());
		//尝试读取MetaData
		this.addChild(new MetaReader());

		//如果MetaData无法读取或者读取错误，则重新获取MetaData
		this.addChild(
			new ActionForFunc(async () => {
				//如果MetaData读取有错误
				if (context.metaData.status) {
					context.logger?.('debug', 'Recreate metaData as it has invalid status', this, this.context);
					//3.1 获取资源情况
					this.addChild(new HeadRequest());
					//3.2 生成下载线程
					this.addChild(new ThreadsGenerator());
					//3.3 写入MetaData
					this.addChild(new MetaWriter());
				}
				//下载
				this.addChild(new DataRequest());
			})
		);
		//关闭文件句柄
		this.watch(async () => {
			//保存文件
			await new FileClose().start(context);
			//如果有后处理脚本，调用
			if (this.isResolved() && context.postloader) {
				try {
					context.logger?.('verbose', 'Postloader File', this, this.context);
					await context.postloader(this, context);
				} catch (err) {
					context.logger?.('error', `PostLoader Error: ${err}`);
				}
			}
		}, 0);
		return super.doStart(context);
	}
}
