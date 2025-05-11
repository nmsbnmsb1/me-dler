"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a, _b, _c, _d;
        let { metaData } = context;
        if (context.overwrite === 'all' && (await (0, utils_1.fsPromisify)(node_fs_1.default.exists, context.file))) {
            (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'debug', `Delete file at ${context.file} as overwrite setted.`, this, this.context);
            await (0, utils_1.fsPromisify)(node_fs_1.default.unlink, context.file);
        }
        let existsDLFile = await (0, utils_1.fsPromisify)(node_fs_1.default.exists, metaData.dlFile);
        if ((context.overwrite === 'all' || context.overwrite === 'dl') && existsDLFile) {
            (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'debug', `Delete .dl file at ${metaData.dlFile}`, this, this.context);
            await (0, utils_1.fsPromisify)(node_fs_1.default.unlink, metaData.dlFile);
            existsDLFile = false;
        }
        if (await (0, utils_1.fsPromisify)(node_fs_1.default.exists, metaData.errFile)) {
            (_c = context.logger) === null || _c === void 0 ? void 0 : _c.call(context, 'debug', `Delete .err file at ${metaData.errFile}`, this, this.context);
            await (0, utils_1.fsPromisify)(node_fs_1.default.unlink, metaData.errFile);
        }
        if (context.mkdir) {
            let dir = node_path_1.default.dirname(metaData.dlFile);
            if (!(await (0, utils_1.fsPromisify)(node_fs_1.default.exists, dir)))
                await (0, utils_1.fsPromisify)(node_fs_1.default.mkdir, dir);
        }
        try {
            (_d = context.logger) === null || _d === void 0 ? void 0 : _d.call(context, 'debug', `Open .dl file at ${metaData.dlFile}`, this, this.context);
            metaData.dlDescriptor = await (0, utils_1.fsPromisify)(node_fs_1.default.open, metaData.dlFile, !existsDLFile ? 'w+' : 'r+', undefined);
        }
        catch (err) {
            throw (0, utils_1.e)(context, 'file_failed', metaData.dlFile);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-open.js.map