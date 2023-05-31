"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeMeta = void 0;
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
function writeMeta(context) {
    let { metaData } = context;
    try {
        let meta = {
            ddxc: metaData.ddxc,
            url: metaData.url,
            fileSize: metaData.fileSize,
            threads: metaData.threads,
        };
        let buffer = Buffer.alloc(context.metaSize);
        buffer.fill(' ');
        let dataString = JSON.stringify(meta);
        buffer.write(dataString);
        let writePosition = metaData.fileSize;
        fs_1.default.writeSync(metaData.dlDescriptor, buffer, 0, buffer.length, writePosition);
    }
    catch (err) {
        throw (0, utils_1.e)(1003, metaData.dlFile);
    }
}
exports.writeMeta = writeMeta;
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        writeMeta(context);
    }
}
exports.default = default_1;
//# sourceMappingURL=meta-writer.js.map