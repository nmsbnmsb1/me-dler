import { Action } from 'me-actions';
import { request } from '../http';
import e from '../errs';
export default class extends Action {
    async doStart({ dl }) {
        var _a;
        let response;
        try {
            response = await request({ method: 'HEAD', url: dl.url, headers: dl.headers, timeout: dl.timeout });
        }
        catch (err) {
            throw e(1004, `${err}: ${dl.url}`);
        }
        let fileSize = parseInt(response.headers['content-length']);
        if (isNaN(fileSize))
            throw e(1008, dl.url);
        let acceptRanges = response.headers['accept-ranges'];
        let response_url = ((_a = response.request) === null || _a === void 0 ? void 0 : _a.responseUrl) || dl.url;
        dl.results.fileSize = fileSize;
        dl.results.acceptRanges = acceptRanges === 'bytes';
        dl.results.url = response_url;
    }
}
//# sourceMappingURL=head-request.js.map