"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a;
        let response;
        try {
            response = await (0, utils_1.request)({ method: 'HEAD', url: context.url, headers: context.headers, timeout: context.timeout });
        }
        catch (err) {
            throw (0, utils_1.e)(1004, `${err}: ${context.url}`);
        }
        let fileSize = parseInt(response.headers['content-length']);
        if (isNaN(fileSize))
            throw (0, utils_1.e)(1008, context.url);
        let acceptRanges = response.headers['accept-ranges'];
        let response_url = ((_a = response.request) === null || _a === void 0 ? void 0 : _a.responseUrl) || context.url;
        context.runtime.fileSize = fileSize;
        context.runtime.acceptRanges = acceptRanges === 'bytes';
        context.runtime.url = response_url;
    }
}
exports.default = default_1;
//# sourceMappingURL=head-request.js.map