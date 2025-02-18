import fs from 'node:fs';
import { ActionForFunc, ErrHandler, RunOne } from 'me-actions';

import type { DLContext } from './context';
import { e } from './utils';

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

	protected async doStart(context: DLContext) {
		//如果有预载脚本，则预载
		if (context.preloader) {
			await context.preloader(this, context);
		}
		//查看文件是否已下载
		if (!context.url) throw e(context, 'no_url');
		if (!context.file) throw e(context, 'no_file');
		if (!context.overwrite && fs.existsSync(context.file)) {
			return;
		}
		//
		if (context.logger) {
			context.logger('info', `start download ${context.url} to ${context.file}`, this, this.context);
		}
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
					//3.1 获取资源情况
					this.addChild(new HeadRequest());
					//3.2 生成下载线程
					this.addChild(new ThreadsGenerator());
					//3.3 写入MetaData
					this.addChild(new MetaWriter());
				}
				//下载
				this.addChild(new DataRequest());
				this.addChild(new FileClose());
			})
		);
		//关闭文件句柄
		// this.watch(() => {
		// 	return new FileClose().start(context);
		// });
		//
		return super.doStart(context);
	}
}
