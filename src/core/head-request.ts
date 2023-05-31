import fs from 'fs';
import { AxiosResponse } from 'axios';
import { Action } from 'me-actions';
import { IDLContext } from '../context';
import { e, request } from '../utils';

export default class extends Action {
	protected async doStart(context: IDLContext) {
		//预检，判断资源是否存在,是否可以断点续传
		let responseError: Error;
		let response: AxiosResponse;
		try {
			response = await request({
				method: 'HEAD',
				url: context.url,
				headers: context.headers ? JSON.parse(JSON.stringify(context.headers)) : {},
				timeout: context.timeout,
			});
		} catch (err) {
			//如果http_status异常
			responseError = err;
		}
		//如果http_status异常
		let { metaData } = context;
		//
		if (responseError) {
			metaData.status = JSON.stringify({ url: context.url, message: responseError.message });
			//写入错误
			fs.writeFileSync(metaData.errFile, metaData.status, { mode: 0o777 });
			//如果没有写入数据，则删除文件
			if (fs.fstatSync(metaData.dlDescriptor).size <= 0) {
				fs.closeSync(metaData.dlDescriptor);
				fs.unlinkSync(metaData.dlFile);
			}
			//
			throw e(1002, context.url);
		}
		//
		let fileSize = parseInt(response.headers['content-length']);
		metaData.status = undefined;
		metaData.url = response.request?.responseUrl || context.url;
		//
		if (isNaN(fileSize)) {
			metaData.ddxc = false;
			metaData.acceptRanges = true;
			metaData.fileSize = 0;
		} else {
			metaData.ddxc = true;
			metaData.acceptRanges = response.headers['accept-ranges'] === 'bytes';
			metaData.fileSize = fileSize;
		}
	}
}
