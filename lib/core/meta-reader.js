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
        metaData.status = 'invalid';
        let stats = fs_1.default.fstatSync(metaData.dlDescriptor);
        let actualSize = stats.size;
        if (actualSize < context.metaSize)
            return;
        try {
            let readPostion = actualSize - context.metaSize;
            let buffer = Buffer.alloc(context.metaSize);
            fs_1.default.readSync(metaData.dlDescriptor, buffer, 0, buffer.length, readPostion);
            let meta = JSON.parse(buffer.toString());
            metaData.status = undefined;
            metaData.ddxc = meta.ddxc;
            metaData.url = meta.url;
            metaData.fileSize = meta.fileSize;
            metaData.threads = meta.threads;
            if (!meta.ddxc) {
                metaData.fileSize = 0;
                if (metaData.threads && metaData.threads[0]) {
                    metaData.threads[0].start = metaData.threads[0].end = metaData.threads[0].position = 0;
                }
            }
        }
        catch (err) { }
    }
}
exports.default = default_1;
//# sourceMappingURL=meta-reader.js.map