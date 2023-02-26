import { IContext } from 'me-actions';

export interface IThread {
	start: number;
	end: number;
	position: number;
}

export interface IDLContext extends IContext {
	dl: {
		//下载文件的绝对路径
		url: string;
		//保存文件的绝对路径
		file: string;
		//下载的控制细节
		mtdfile?: string;
		overwrite?: boolean;
		mkdir?: boolean; //default true
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
		oneThreadSize?: number; //(Default: 500k)
		//Control the part of file that needs to be downloaded.
		range?: string; //(Default: '0-100')
		//metaData size
		metaSize?: number; //(Default: 10 * 1024)

		//运行时
		results?: {
			fd: number;
			fileSize: number;
			acceptRanges: boolean;
			url: string;
			//url_object?: url.UrlWithStringQuery;
			//headers: any;
			threads: IThread[];
		};
	};
}
