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
        let { metaData } = context;
        let isCompleted = true;
        for (let thread of metaData.threads) {
            if (thread.position < thread.end) {
                isCompleted = false;
                break;
            }
        }
        if (!isCompleted)
            throw (0, utils_1.e)(1013);
        fs_1.default.ftruncateSync(metaData.dlDescriptor, metaData.fileSize);
        fs_1.default.closeSync(metaData.dlDescriptor);
        fs_1.default.renameSync(metaData.dlFile, context.file);
    }
}
exports.default = default_1;
//# sourceMappingURL=file-close.js.map