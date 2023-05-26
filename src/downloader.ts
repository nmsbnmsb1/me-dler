import fs from 'fs';
import { RunOne, ErrHandler } from 'me-actions';
import { IDLContext } from './context';
import FileOpen from './core/file-open';
import HeadRequest from './core/head-request';
import ThreadsGenerator from './core/threads-generator';
import MetaWriter from './core/meta-writer';
import MetaReader from './core/meta-reader';
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
		if (fs.existsSync(context.file)) {
			return;
		}
		//初始化context
		{
			if (context.mkdir !== false) context.mkdir = true;
			if (context.overwrite !== true) context.overwrite = false;
			if (!context.mtdfile) context.mtdfile = `${context.file}.mtd`;
			//
			if (!context.proxy) context.proxy = 'http://127.0.0.1:1087';
			if (!context.timeout) context.timeout = 5000;
			if (!context.method) context.method = 'GET';
			if (!context.headers) context.headers = {};
			if (!context.threads) context.threads = 3;
			if (!context.noThreadsSize) context.noThreadsSize = 500 * 1024;
			if (!context.range) context.range = '0-100';
			if (!context.metaSize) context.metaSize = 10 * 1024;
			//
			context.runtime = {} as any;
		}
		//
		let mode = 1;
		if (fs.existsSync(context.mtdfile)) {
			if (context.overwrite) {
				fs.rmSync(context.mtdfile);
			} else {
				mode = 2;
			}
		}
		//
		if (mode === 1) {
			this.addChild(new FileOpen());
			this.addChild(new HeadRequest());
			this.addChild(new ThreadsGenerator());
			this.addChild(new MetaWriter());
			//this.addChild(new MetaReader());
			this.addChild(new DataRequest());
			this.addChild(new FileClose());
		} else if (mode === 2) {
			this.addChild(new FileOpen());
			this.addChild(new MetaReader());
			this.addChild(new DataRequest());
			this.addChild(new FileClose());
		}
		//x
		return super.doStart(context);
	}
}
