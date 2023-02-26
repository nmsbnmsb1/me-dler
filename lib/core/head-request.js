"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
const http_1 = require("../http");
const errs_1 = __importDefault(require("../errs"));
class default_1 extends me_actions_1.Action {
    async doStart({ dl }) {
        var _a;
        let response;
        try {
            response = await (0, http_1.request)({ method: 'HEAD', url: dl.url, headers: dl.headers, timeout: dl.timeout });
        }
        catch (err) {
            throw (0, errs_1.default)(1004, `${err}: ${dl.url}`);
        }
        let fileSize = parseInt(response.headers['content-length']);
        if (isNaN(fileSize))
            throw (0, errs_1.default)(1008, dl.url);
        let acceptRanges = response.headers['accept-ranges'];
        let response_url = ((_a = response.request) === null || _a === void 0 ? void 0 : _a.responseUrl) || dl.url;
        dl.results.fileSize = fileSize;
        dl.results.acceptRanges = acceptRanges === 'bytes';
        dl.results.url = response_url;
    }
}
exports.default = default_1;
//# sourceMappingURL=head-request.js.map