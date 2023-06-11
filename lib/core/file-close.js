"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        let { metaData } = context;
        if (!metaData.dlDescriptor)
            return;
        let completed = true;
        if (metaData.threads && metaData.threads.length > 0) {
            for (let thread of metaData.threads) {
                if (thread.end === 0 || thread.position < thread.end) {
                    completed = false;
                    break;
                }
            }
        }
        else {
            completed = false;
        }
        if (!completed) {
            if (fs_1.default.fstatSync(metaData.dlDescriptor).size <= 0) {
                fs_1.default.closeSync(metaData.dlDescriptor);
                fs_1.default.unlinkSync(metaData.dlFile);
            }
            else {
                fs_1.default.closeSync(metaData.dlDescriptor);
            }
        }
        else {
            fs_1.default.ftruncateSync(metaData.dlDescriptor, metaData.fileSize);
            fs_1.default.closeSync(metaData.dlDescriptor);
            fs_1.default.renameSync(metaData.dlFile, context.file);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-close.js.map