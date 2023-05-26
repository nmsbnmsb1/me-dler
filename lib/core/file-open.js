"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        if (context.mkdir && !fs_1.default.existsSync(path_1.default.dirname(context.mtdfile))) {
            fs_1.default.mkdirSync(path_1.default.dirname(context.mtdfile));
        }
        try {
            context.runtime.fileDescriptor = fs_1.default.openSync(context.mtdfile, !fs_1.default.existsSync(context.mtdfile) ? 'w+' : 'r+', undefined);
        }
        catch (err) {
            throw (0, utils_1.e)(1007, context.mtdfile);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-open.js.map