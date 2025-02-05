"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Downloader = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
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
        if (context.preloader) {
            await context.preloader(this, context);
        }
        if (!context.url)
            throw (0, utils_1.e)('no_url');
        if (!context.file)
            throw (0, utils_1.e)('no_file');
        if (!context.overwrite && node_fs_1.default.existsSync(context.file)) {
            return;
        }
        if (context.logger) {
            context.logger('info', `start download ${context.url} to ${context.file}`, this, this.context);
        }
        this.addChild(new init_context_1.default());
        this.addChild(new file_open_1.default());
        this.addChild(new meta_reader_1.default());
        this.addChild(new me_actions_1.ActionForFunc(async () => {
            if (context.metaData.status) {
                this.addChild(new head_request_1.default());
                this.addChild(new threads_generator_1.default());
                this.addChild(new meta_writer_1.default());
            }
            this.addChild(new data_request_1.default());
        }));
        this.watch(() => {
            return new file_close_1.default().start(context);
        });
        return super.doStart(context);
    }
}
exports.Downloader = Downloader;
//# sourceMappingURL=downloader.js.map