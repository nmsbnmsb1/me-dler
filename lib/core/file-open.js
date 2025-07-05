"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a, _b, _c;
        let { metaData } = context;
        let existsDLFile = await (0, utils_1.isExists)(metaData.dlFile);
        if (existsDLFile && (context.overwrite === 'all' || context.overwrite === 'dl')) {
            (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'debug', `Delete .dl file at ${metaData.dlFile}`, this, this.context);
            await promises_1.default.rm(metaData.dlFile);
            existsDLFile = false;
        }
        let existsErrFile = await (0, utils_1.isExists)(metaData.errFile);
        if (existsErrFile) {
            (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'debug', `Delete .err file at ${metaData.errFile}`, this, this.context);
            await promises_1.default.rm(metaData.errFile);
            existsErrFile = false;
        }
        if (context.mkdir) {
            await promises_1.default.mkdir(node_path_1.default.dirname(metaData.dlFile), { recursive: true });
        }
        try {
            (_c = context.logger) === null || _c === void 0 ? void 0 : _c.call(context, 'debug', `Open .dl file at ${metaData.dlFile}`, this, this.context);
            metaData.dlHandle = await promises_1.default.open(metaData.dlFile, !existsDLFile ? 'w+' : 'r+');
        }
        catch (err) {
            throw (0, utils_1.e)(context, 'file_failed', metaData.dlFile);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-open.js.map