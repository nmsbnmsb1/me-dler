"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a, _b, _c;
        let { metaData } = context;
        if (metaData.dlDescriptor) {
            let hasDown = true;
            if (!metaData.threads || metaData.threads.length <= 0) {
                hasDown = false;
            }
            else {
                for (let thread of metaData.threads) {
                    if (!thread.done) {
                        hasDown = false;
                        break;
                    }
                }
            }
            if (!hasDown) {
                context.hasDown = false;
                let size = node_fs_1.default.fstatSync(metaData.dlDescriptor).size;
                try {
                    if (size <= context.metaSize) {
                        node_fs_1.default.closeSync(metaData.dlDescriptor);
                        node_fs_1.default.unlinkSync(metaData.dlFile);
                    }
                    else {
                        node_fs_1.default.closeSync(metaData.dlDescriptor);
                    }
                }
                catch (e) {
                    context.errs.push(e);
                }
                (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'verbose', `File hasn't been downloaded.`, this, this.context);
            }
            else {
                context.hasDown = true;
                node_fs_1.default.ftruncateSync(metaData.dlDescriptor, metaData.fileSize);
                node_fs_1.default.closeSync(metaData.dlDescriptor);
                let maxRetries = 3;
                let e;
                for (let i = 0; i < maxRetries; i++) {
                    try {
                        node_fs_1.default.renameSync(metaData.dlFile, context.file);
                        (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'verbose', `File has been saved to ${context.file}`, this, this.context);
                        return;
                    }
                    catch (err) {
                        if (i < maxRetries - 1) {
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                        }
                        else {
                            e = err;
                            break;
                        }
                    }
                }
                if (e) {
                    context.errs.push(e);
                }
            }
        }
        if (context.writeErrFile && context.errs.length > 0) {
            let errs = [];
            for (let err of context.errs)
                errs.push([...err.stack.split('\n')]);
            try {
                node_fs_1.default.writeFileSync(metaData.errFile, JSON.stringify({ url: context.url, errs }, undefined, 4), { mode: 0o777 });
            }
            catch (e) {
                (_c = context.logger) === null || _c === void 0 ? void 0 : _c.call(context, 'error', `Couldnot write err file at ${metaData.errFile}`, this, this.context);
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-close.js.map