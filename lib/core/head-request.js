"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
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
            response = await (0, utils_1.request)(context, {
                method: 'HEAD',
                url: context.url,
                headers: context.headers,
                timeout: context.timeout,
            });
        }
        catch (err) {
            responseError = err;
        }
        if (responseError) {
            throw (0, utils_1.e)(context, 'data_failed', responseError.message, `HEAD: ${context.url}`);
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
exports.default = default_1;
//# sourceMappingURL=head-request.js.map