"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a, _b, _c, _d;
        let { metaData } = context;
        metaData.status = 'invalid';
        let stats = node_fs_1.default.fstatSync(metaData.dlDescriptor);
        let actualSize = stats.size;
        if (actualSize < context.metaSize) {
            (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'debug', `Metadata read failed: file size (${actualSize}) is smaller than required metadata size (${context.metaSize})`, this, this.context);
            return;
        }
        try {
            let readPostion = actualSize - context.metaSize;
            let buffer = Buffer.alloc(context.metaSize);
            node_fs_1.default.readSync(metaData.dlDescriptor, buffer, 0, buffer.length, readPostion);
            let meta = JSON.parse(buffer.toString());
            metaData.status = undefined;
            metaData.ddxc = meta.ddxc;
            metaData.url = meta.url;
            metaData.fileSize = meta.fileSize;
            metaData.threads = meta.threads;
            if (!meta.ddxc) {
                metaData.fileSize = 0;
                if ((_b = metaData.threads) === null || _b === void 0 ? void 0 : _b[0]) {
                    metaData.threads[0].start = metaData.threads[0].end = metaData.threads[0].position = 0;
                    metaData.threads[0].done = false;
                }
            }
            (_c = context.logger) === null || _c === void 0 ? void 0 : _c.call(context, 'debug', `MetaData readed: ${JSON.stringify(metaData)}`, this, this.context);
        }
        catch (err) {
            (_d = context.logger) === null || _d === void 0 ? void 0 : _d.call(context, 'error', `MetaData could not be readed on path: ${context.file}`, this, this.context);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=meta-reader.js.map