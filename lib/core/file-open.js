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
        if (context.overwrite && node_fs_1.default.existsSync(context.file)) {
            (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'debug', `Delete file at ${context.file} as overwrite setted.`, this, this.context);
            node_fs_1.default.unlinkSync(context.file);
        }
        let existsDLFile = node_fs_1.default.existsSync(metaData.dlFile);
        if (context.overwrite && existsDLFile) {
            (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'debug', `Delete .dl file at ${metaData.dlFile}`, this, this.context);
            node_fs_1.default.unlinkSync(metaData.dlFile);
            existsDLFile = false;
        }
        if (node_fs_1.default.existsSync(metaData.errFile)) {
            (_c = context.logger) === null || _c === void 0 ? void 0 : _c.call(context, 'debug', `Delete .err file at ${metaData.errFile}`, this, this.context);
            node_fs_1.default.unlinkSync(metaData.errFile);
        }
        if (context.mkdir) {
            let dir = node_path_1.default.dirname(metaData.dlFile);
            if (!node_fs_1.default.existsSync(dir))
                node_fs_1.default.mkdirSync(dir);
        }
        try {
            (_d = context.logger) === null || _d === void 0 ? void 0 : _d.call(context, 'debug', `Open .dl file at ${metaData.dlFile}`, this, this.context);
            metaData.dlDescriptor = node_fs_1.default.openSync(metaData.dlFile, !existsDLFile ? 'w+' : 'r+', undefined);
        }
        catch (err) {
            throw (0, utils_1.e)(context, 'file_failed', metaData.dlFile);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-open.js.map