import { IContext } from 'me-actions';

export interface IThread {
	start: number;
	end: number;
	position: number;
	done: boolean;
}

export interface IMetaData {
	//${filename}.dl
	dlFile: string;
	dlDescriptor: number;
	errFile: string;
	//
	status: string;
	ddxc: boolean;
	url: string;
	acceptRanges: boolean;
	fileSize: number;
	threads: IThread[];
	//
	err?: Error;
}

export interface IDLContext extends IContext {
	//预载
	preloader?: (context: IDLContext) => Promise<any>;
	//下载文件的绝对路径
	url?: string;
	//保存文件的绝对路径
	file?: string;
	//下载的控制细节
	mkdir?: boolean; //default true
	overwrite?: boolean; //default false
	writeErrFile?: boolean; //default true 写入错误文件
	skipHeadRequest?: boolean; //default false 跳过head请求
	//Proxy 代理
	proxy?: string;
	//If no data is received the download times out. It is measured in mileseconds.
	timeout?: number; //(Default: 10 seconds)
	//HTTP method
	method?: string; //(Default: GET)
	//To set custom headers, such as cookies etc.
	headers?: { [name: string]: any };
	//To set the total number of download threads
	threads?: number; //(Default: 3)
	//小文件不分块
	threadsLimit?: number; //(Default: 500k)
	//Control the part of file that needs to be downloaded.
	range?: string; //(Default: '0-100')
	//metaData size
	metaSize?: number; //(Default: 10 * 1024)
	//
	metaData?: IMetaData;
	//下载完成回报
	hasDown?: boolean;
}
