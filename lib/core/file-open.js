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
        let { metaData } = context;
        if (context.overwrite && node_fs_1.default.existsSync(context.file)) {
            node_fs_1.default.unlinkSync(context.file);
        }
        let existsDLFile = node_fs_1.default.existsSync(metaData.dlFile);
        if (context.overwrite) {
            if (existsDLFile) {
                node_fs_1.default.unlinkSync(metaData.dlFile);
                existsDLFile = false;
            }
        }
        if (node_fs_1.default.existsSync(metaData.errFile)) {
            node_fs_1.default.unlinkSync(metaData.errFile);
        }
        if (context.mkdir) {
            let dir = node_path_1.default.dirname(metaData.dlFile);
            if (!node_fs_1.default.existsSync(dir))
                node_fs_1.default.mkdirSync(dir);
        }
        try {
            metaData.dlDescriptor = node_fs_1.default.openSync(metaData.dlFile, !existsDLFile ? 'w+' : 'r+', undefined);
        }
        catch (err) {
            throw (0, utils_1.e)(context, 'file_failed', metaData.dlFile);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-open.js.map