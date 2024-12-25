"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        let { metaData } = context;
        if (context.writeErrFile && context.errs.length > 0) {
            let errs = [];
            for (let err of context.errs)
                errs.push(...err.stack.split('\n'));
            node_fs_1.default.writeFileSync(metaData.errFile, JSON.stringify({ url: context.url, errs }, undefined, 4), { mode: 0o777 });
        }
        if (!metaData.dlDescriptor)
            return;
        let hasDown = true;
        if (!metaData.threads || metaData.threads.length <= 0) {
            hasDown = false;
        }
        else {
            for (let thread of metaData.threads) {
                if (!thread.done) {
                    hasDown = false;
                    break;
                }
            }
        }
        if (!hasDown) {
            context.hasDown = false;
            let size = node_fs_1.default.fstatSync(metaData.dlDescriptor).size;
            if (size <= context.metaSize) {
                node_fs_1.default.closeSync(metaData.dlDescriptor);
                node_fs_1.default.unlinkSync(metaData.dlFile);
            }
            else {
                node_fs_1.default.closeSync(metaData.dlDescriptor);
            }
        }
        else {
            context.hasDown = true;
            node_fs_1.default.ftruncateSync(metaData.dlDescriptor, metaData.fileSize);
            node_fs_1.default.closeSync(metaData.dlDescriptor);
            node_fs_1.default.renameSync(metaData.dlFile, context.file);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-close.js.map