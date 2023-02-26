import { AxiosResponse } from 'axios';
import { Action } from 'me-actions';
import { IDLContext } from '../context';
import { request } from '../http';
import e from '../errs';

export default class extends Action {
	protected async doStart({ dl }: IDLContext) {
		let response: AxiosResponse;
		try {
			response = await request({ method: 'HEAD', url: dl.url, headers: dl.headers, timeout: dl.timeout });
		} catch (err) {
			throw e(1004, `${err}: ${dl.url}`);
		}
		//
		let fileSize = parseInt(response.headers['content-length']);
		if (isNaN(fileSize)) throw e(1008, dl.url);
		let acceptRanges = response.headers['accept-ranges'];
		let response_url = response.request?.responseUrl || dl.url;
		//
		dl.results.fileSize = fileSize;
		dl.results.acceptRanges = acceptRanges === 'bytes';
		dl.results.url = response_url;
		//dl.results.url_object = url.parse(response_url);
	}
}
