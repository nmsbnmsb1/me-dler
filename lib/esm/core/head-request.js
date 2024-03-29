import { Action } from 'me-actions';
import { e, request } from '../utils';
export default class extends Action {
    async doStart(context) {
        var _a;
        let { metaData } = context;
        if (context.skipHeadRequest) {
            metaData.status = undefined;
            metaData.url = context.url;
            metaData.ddxc = false;
            metaData.acceptRanges = true;
            metaData.fileSize = 0;
            return;
        }
        let response;
        let responseError;
        try {
            response = await request({ method: 'HEAD', url: context.url, headers: context.headers, timeout: context.timeout });
        }
        catch (err) {
            responseError = err;
        }
        if (responseError) {
            throw e('data_failed', responseError.message, `HEAD: ${context.url}`);
        }
        else {
            let fileSize = parseInt(response.headers['content-length']);
            metaData.status = undefined;
            metaData.url = ((_a = response.request) === null || _a === void 0 ? void 0 : _a.responseUrl) || context.url;
            if (isNaN(fileSize)) {
                metaData.ddxc = false;
                metaData.acceptRanges = true;
                metaData.fileSize = 0;
            }
            else {
                metaData.ddxc = true;
                metaData.acceptRanges = response.headers['accept-ranges'] === 'bytes';
                metaData.fileSize = fileSize;
            }
        }
    }
}
//# sourceMappingURL=head-request.js.map