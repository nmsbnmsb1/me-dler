import { AxiosResponse } from 'axios';
import { Action } from 'me-actions';
import { IDLContext } from '../context';
import { e, request } from '../utils';

export default class extends Action {
	protected async doStart(context: IDLContext) {
		let response: AxiosResponse;
		try {
			response = await request({ method: 'HEAD', url: context.url, headers: context.headers, timeout: context.timeout });
		} catch (err) {
			throw e(1004, `${err}: ${context.url}`);
		}
		//
		let fileSize = parseInt(response.headers['content-length']);
		if (isNaN(fileSize)) throw e(1008, context.url);
		let acceptRanges = response.headers['accept-ranges'];
		let response_url = response.request?.responseUrl || context.url;
		//
		context.runtime.fileSize = fileSize;
		context.runtime.acceptRanges = acceptRanges === 'bytes';
		context.runtime.url = response_url;
		//context.runtime.url_object = url.parse(response_url);
	}
}
