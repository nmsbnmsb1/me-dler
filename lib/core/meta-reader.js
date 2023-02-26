"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart({ dl }) {
        let { results } = dl;
        try {
            let stats = fs_1.default.fstatSync(results.fd);
            let actualSize = stats.size;
            let readPostion = actualSize - dl.metaSize;
            let buffer = Buffer.alloc(dl.metaSize);
            fs_1.default.readSync(results.fd, buffer, 0, buffer.length, readPostion);
            let meta = JSON.parse(buffer.toString());
            results.fileSize = meta.fileSize;
            results.url = meta.url;
            results.threads = meta.threads;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=meta-reader.js.map