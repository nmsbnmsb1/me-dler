"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        let { runtime } = context;
        try {
            let stats = fs_1.default.fstatSync(runtime.fileDescriptor);
            let actualSize = stats.size;
            let readPostion = actualSize - context.metaSize;
            let buffer = Buffer.alloc(context.metaSize);
            fs_1.default.readSync(runtime.fileDescriptor, buffer, 0, buffer.length, readPostion);
            let meta = JSON.parse(buffer.toString());
            runtime.fileSize = meta.fileSize;
            runtime.url = meta.url;
            runtime.threads = meta.threads;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=meta-reader.js.map