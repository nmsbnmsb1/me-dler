import { Action } from 'me-actions';
import { e, request } from '../utils';
export default class extends Action {
    async doStart(context) {
        var _a;
        let response;
        try {
            response = await request({ method: 'HEAD', url: context.url, headers: context.headers, timeout: context.timeout });
        }
        catch (err) {
            throw e(1004, `${err}: ${context.url}`);
        }
        let fileSize = parseInt(response.headers['content-length']);
        if (isNaN(fileSize))
            throw e(1008, context.url);
        let acceptRanges = response.headers['accept-ranges'];
        let response_url = ((_a = response.request) === null || _a === void 0 ? void 0 : _a.responseUrl) || context.url;
        context.runtime.fileSize = fileSize;
        context.runtime.acceptRanges = acceptRanges === 'bytes';
        context.runtime.url = response_url;
    }
}
//# sourceMappingURL=head-request.js.map