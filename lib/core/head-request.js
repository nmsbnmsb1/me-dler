"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a;
        let responseError;
        let response;
        try {
            response = await (0, utils_1.request)({
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
            fs_1.default.writeFileSync(metaData.errFile, metaData.status, { mode: 0o777 });
            if (fs_1.default.fstatSync(metaData.dlDescriptor).size <= 0) {
                fs_1.default.closeSync(metaData.dlDescriptor);
                fs_1.default.unlinkSync(metaData.dlFile);
            }
            throw (0, utils_1.e)(1002, context.url);
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