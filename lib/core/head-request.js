"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a, _b, _c, _d, _e;
        let { metaData } = context;
        if (context.skipHeadRequest || context.threads <= 1) {
            metaData.status = undefined;
            metaData.url = context.url;
            metaData.ddxc = false;
            metaData.acceptRanges = true;
            metaData.fileSize = 0;
            if (context.skipHeadRequest) {
                (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'debug', `Skip Head Request: ${JSON.stringify(metaData)}`, this, this.context);
            }
            else {
                (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'debug', `Download Thread = 1: ${JSON.stringify(metaData)}`, this, this.context);
            }
            return;
        }
        let response;
        let responseError;
        try {
            (_c = context.logger) === null || _c === void 0 ? void 0 : _c.call(context, 'http', `HEAD: ${context.url}`, this, this.context);
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
        metaData.url = ((_d = response.request) === null || _d === void 0 ? void 0 : _d.responseUrl) || context.url;
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
        (_e = context.logger) === null || _e === void 0 ? void 0 : _e.call(context, 'debug', `Created metadata: ${JSON.stringify(metaData)}`, this, this.context);
    }
}
exports.default = default_1;
//# sourceMappingURL=head-request.js.map