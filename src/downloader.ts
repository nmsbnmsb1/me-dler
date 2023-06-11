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
		super(ErrHandler.RejectAllDone);
		this.context = context;
	}

	protected async doStart(context: IDLContext) {
		//查看文件是否已下载
		if (fs.existsSync(context.file)) return;
		//
		let one = new RunOne(ErrHandler.RejectImmediately);
		{
			//0.初始化context
			one.addChild(new InitContext());
			//1.准备要下载的文件
			one.addChild(new FileOpen());
			//2.尝试读取MetaData
			one.addChild(new MetaReader());
			//3.如果MetaData无法读取或者读取错误，则重新获取MetaData
			one.addChild(
				new ActionForFunc(async () => {
					//如果MetaData读取有错误
					if (context.metaData.status) {
						//3.1 获取资源情况
						one.addChild(new HeadRequest());
						//3.2 生成下载线程
						one.addChild(new ThreadsGenerator());
						//3.3 写入MetaData
						one.addChild(new MetaWriter());
					}
					//
					one.addChild(new DataRequest());
				})
			);
		}
		this.addChild(one);
		//
		this.addChild(new FileClose());
		//
		return super.doStart(context);
	}
}
