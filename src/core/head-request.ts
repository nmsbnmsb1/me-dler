import { AxiosResponse } from 'axios';
import { Action } from 'me-actions';
import { DLContext } from '../context';
import { e, request } from '../utils';

export default class extends Action {
	protected async doStart(context: DLContext) {
		let { metaData } = context;
		//
		if (context.skipHeadRequest) {
			metaData.status = undefined;
			metaData.url = context.url;
			metaData.ddxc = false;
			metaData.acceptRanges = true;
			metaData.fileSize = 0;
			return;
		}
		//
		//预检，判断资源是否存在,是否可以断点续传
		let response: AxiosResponse;
		let responseError: Error;
		try {
			response = await request({ method: 'HEAD', url: context.url, headers: context.headers, timeout: context.timeout });
		} catch (err) {
			//如果http_status异常
			responseError = err;
		}
		//
		//如果http_status异常
		if (responseError) {
			//写入错误
			// metaData.status = JSON.stringify({ method: 'HEAD', url: context.url, message: responseError.message }, undefined, 4);
			// fs.writeFileSync(metaData.errFile, metaData.status, { mode: 0o777 });
			throw e('data_failed', responseError.message, `HEAD: ${context.url}`);
			//
			// metaData.status = undefined;
			// metaData.url = context.url;
			// metaData.ddxc = false;
			// metaData.acceptRanges = true;
			// metaData.fileSize = 0;
			//
		} else {
			let fileSize = parseInt(response.headers['content-length']);
			metaData.status = undefined;
			metaData.url = response.request?.responseUrl || context.url;
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
}
