"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
const errs_1 = __importDefault(require("../errs"));
class default_1 extends me_actions_1.Action {
    async doStart({ dl }) {
        let { results } = dl;
        let isCompleted = true;
        for (let thread of results.threads) {
            if (thread.position < thread.end) {
                isCompleted = false;
                break;
            }
        }
        if (!isCompleted)
            throw (0, errs_1.default)(1013);
        fs_1.default.ftruncateSync(results.fd, results.fileSize);
        fs_1.default.closeSync(results.fd);
        fs_1.default.renameSync(dl.mtdfile, dl.file);
    }
}
exports.default = default_1;
//# sourceMappingURL=file-close.js.map