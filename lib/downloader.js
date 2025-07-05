"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Downloader = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const me_actions_1 = require("me-actions");
const utils_1 = require("./utils");
const data_request_1 = __importDefault(require("./core/data-request"));
const file_close_1 = __importDefault(require("./core/file-close"));
const file_open_1 = __importDefault(require("./core/file-open"));
const head_request_1 = __importDefault(require("./core/head-request"));
const init_context_1 = __importDefault(require("./core/init-context"));
const meta_reader_1 = __importDefault(require("./core/meta-reader"));
const meta_writer_1 = __importDefault(require("./core/meta-writer"));
const threads_generator_1 = __importDefault(require("./core/threads-generator"));
class Downloader extends me_actions_1.RunOne {
    constructor(context) {
        super(me_actions_1.ErrHandler.RejectImmediately);
        this.context = context;
    }
    async doStart(context) {
        var _a, _b, _c, _d;
        if (context.preloader) {
            try {
                (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'verbose', 'Preloader File', this, this.context);
                await context.preloader(this, context);
            }
            catch (err) {
                throw (0, utils_1.e)(context, 'preload_failed', err);
            }
        }
        if (!context.url)
            throw (0, utils_1.e)(context, 'no_url');
        if (!context.file)
            throw (0, utils_1.e)(context, 'no_file');
        if (await (0, utils_1.isExists)(context.file)) {
            if (context.overwrite !== 'all') {
                (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'warn', `File exists ${context.file}`, this, this.context);
                return;
            }
            (_c = context.logger) === null || _c === void 0 ? void 0 : _c.call(context, 'debug', `Delete file at ${context.file} as overwrite setted.`, this, this.context);
            await promises_1.default.rm(context.file);
        }
        (_d = context.logger) === null || _d === void 0 ? void 0 : _d.call(context, 'verbose', `Start download ${context.url} to ${context.file}`, this, this.context);
        this.addChild(new init_context_1.default());
        this.addChild(new file_open_1.default());
        this.addChild(new meta_reader_1.default());
        this.addChild(new me_actions_1.ActionForFunc(async () => {
            var _a;
            if (context.metaData.status) {
                (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'debug', 'Recreate metaData as it has invalid status', this, this.context);
                this.addChild(new head_request_1.default());
                this.addChild(new threads_generator_1.default());
                this.addChild(new meta_writer_1.default());
            }
            this.addChild(new data_request_1.default());
        }));
        this.watch(async () => {
            var _a, _b;
            await new file_close_1.default().start(context);
            if (this.isResolved() && context.postloader) {
                try {
                    (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'verbose', 'Postloader File', this, this.context);
                    await context.postloader(this, context);
                }
                catch (err) {
                    (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'error', `PostLoader Error: ${err}`);
                }
            }
        }, 0);
        return super.doStart(context);
    }
}
exports.Downloader = Downloader;
//# sourceMappingURL=downloader.js.map