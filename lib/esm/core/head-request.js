import fs from 'fs';
import { Action } from 'me-actions';
import { e, request } from '../utils';
export default class extends Action {
    async doStart(context) {
        var _a;
        let responseError;
        let response;
        try {
            response = await request({
                method: 'HEAD',
                url: context.url,
                headers: context.headers ? JSON.parse(JSON.stringify(context.headers)) : {},
                timeout: context.timeout,
            });
        }
        catch (err) {
            responseError = err;
        }
        let { metaData } = context;
        if (responseError) {
            metaData.status = JSON.stringify({ url: context.url, message: responseError.message });
            fs.writeFileSync(metaData.errFile, metaData.status, { mode: 0o777 });
            if (fs.fstatSync(metaData.dlDescriptor).size <= 0) {
                fs.closeSync(metaData.dlDescriptor);
                fs.unlinkSync(metaData.dlFile);
            }
            throw e(1002, context.url);
        }
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
//# sourceMappingURL=head-request.js.map