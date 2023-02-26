"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
const errs_1 = __importDefault(require("../errs"));
class default_1 extends me_actions_1.Action {
    async doStart({ dl }) {
        if (dl.mkdir && !fs_1.default.existsSync(path_1.default.dirname(dl.mtdfile)))
            fs_1.default.mkdirSync(path_1.default.dirname(dl.mtdfile));
        try {
            dl.results.fd = fs_1.default.openSync(dl.mtdfile, !fs_1.default.existsSync(dl.mtdfile) ? 'w+' : 'r+', undefined);
        }
        catch (err) {
            throw (0, errs_1.default)(1007, dl.mtdfile);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-open.js.map