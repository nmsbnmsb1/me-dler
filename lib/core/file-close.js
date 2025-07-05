"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a, _b;
        let { metaData } = context;
        if (metaData.dlHandle) {
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
                try {
                    await metaData.dlHandle.close();
                }
                catch (e) {
                    context.errs.push(e);
                }
                (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'verbose', `File hasn't been downloaded.`, this, this.context);
            }
            else {
                context.hasDown = true;
                await metaData.dlHandle.truncate(metaData.fileSize);
                await metaData.dlHandle.close();
                await promises_1.default.rename(metaData.dlFile, context.file);
            }
        }
        if (context.writeErrFile && context.errs.length > 0) {
            let errs = [];
            for (let err of context.errs)
                errs.push([...err.stack.split('\n')]);
            try {
                await promises_1.default.writeFile(metaData.errFile, JSON.stringify({ url: context.url, errs }, undefined, 4), {
                    mode: 0o777,
                });
            }
            catch (e) {
                (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'error', `Couldnot write err file at ${metaData.errFile}`, this, this.context);
            }
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=file-close.js.map