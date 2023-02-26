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
		let { dl } = context;
		//
		if (fs.existsSync(dl.file)) return;
		//初始化
		{
			dl.mtdfile = `${dl.file}.mtd`;
			if (dl.mkdir !== false) dl.mkdir = true;
			//
			if (!dl.timeout) dl.timeout = 5000;
			if (!dl.method) dl.method = 'GET';
			if (!dl.headers) dl.headers = {};
			if (!dl.threads) dl.threads = 3;
			if (!dl.oneThreadSize) dl.oneThreadSize = 500 * 1024;
			if (!dl.range) dl.range = '0-100';
			if (!dl.metaSize) dl.metaSize = 10 * 1024;
			//
			dl.results = {} as any;
		}
		//
		let mode = 1;
		if (fs.existsSync(dl.mtdfile)) {
			if (dl.overwrite) fs.rmSync(dl.mtdfile);
			else {
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
