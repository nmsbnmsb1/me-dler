"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeMeta = void 0;
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
function writeMeta({ dl }) {
    let { results } = dl;
    try {
        let meta = {
            fileSize: results.fileSize,
            url: results.url,
            threads: results.threads,
        };
        let buffer = Buffer.alloc(dl.metaSize);
        buffer.fill(' ');
        let dataString = JSON.stringify(meta);
        buffer.write(dataString);
        let writePosition = results.fileSize;
        fs_1.default.writeSync(results.fd, buffer, 0, buffer.length, writePosition);
    }
    catch (err) {
        throw err;
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