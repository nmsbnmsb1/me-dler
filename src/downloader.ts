import fs from 'fs';
import { ActionForFunc, ErrHandler, RunOne } from 'me-actions';
import { IDLContext } from './context';
//
import InitContext from './core/init-context';
import FileOpen from './core/file-open';
import MetaReader from './core/meta-reader';
import HeadRequest from './core/head-request';
import ThreadsGenerator from './core/threads-generator';
import MetaWriter from './core/meta-writer';
import DataRequest from './core/data-request';
import FileClose from './core/file-close';

export class Downloader extends RunOne {
	protected context: IDLContext;

	constructor(context: IDLContext) {
		super(ErrHandler.RejectImmediately);
		this.context = context;
	}

	protected async doStart(context: IDLContext) {
		//查看文件是否已下载
		if (fs.existsSync(context.file)) return;
		//
		//0.初始化context
		this.addChild(new InitContext());
		//1.准备要下载的文件
		this.addChild(new FileOpen());
		//2.尝试读取MetaData
		this.addChild(new MetaReader());
		//3.如果MetaData无法读取或者读取错误，则重新获取MetaData
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
				//
				this.addChild(new DataRequest());
				this.addChild(new FileClose());
			})
		);
		//
		return super.doStart(context);
	}
}
