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
        let { metaData } = context;
        let existsDLFile = fs_1.default.existsSync(metaData.dlFile);
        if (context.overwrite) {
            if (existsDLFile) {
                fs_1.default.unlinkSync(metaData.dlFile);
                existsDLFile = false;
            }
        }
        if (fs_1.default.existsSync(metaData.errFile)) {
            fs_1.default.unlinkSync(metaData.errFile);
        }
        if (context.mkdir) {
            let dir = path_1.default.dirname(metaData.dlFile);
            if (!fs_1.default.existsSync(dir))
                fs_1.default.mkdirSync(dir);
        }
        try {
            metaData.dlDescriptor = fs_1.default.openSync(metaData.dlFile, !existsDLFile ? 'w+' : 'r+', undefined);
        }
        catch (err) {
            throw (0, utils_1.e)(1001, metaData.dlFile);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-open.js.map