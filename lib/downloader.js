"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Downloader = void 0;
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
const file_open_1 = __importDefault(require("./core/file-open"));
const head_request_1 = __importDefault(require("./core/head-request"));
const threads_generator_1 = __importDefault(require("./core/threads-generator"));
const meta_writer_1 = __importDefault(require("./core/meta-writer"));
const meta_reader_1 = __importDefault(require("./core/meta-reader"));
const data_request_1 = __importDefault(require("./core/data-request"));
const file_close_1 = __importDefault(require("./core/file-close"));
class Downloader extends me_actions_1.RunOne {
    constructor(context) {
        super(me_actions_1.ErrHandler.RejectImmediately);
        this.context = context;
    }
    async doStart(context) {
        if (fs_1.default.existsSync(context.file)) {
            return;
        }
        {
            if (context.mkdir !== false)
                context.mkdir = true;
            if (context.overwrite !== true)
                context.overwrite = false;
            if (!context.mtdfile)
                context.mtdfile = `${context.file}.mtd`;
            if (!context.proxy)
                context.proxy = 'http://127.0.0.1:1087';
            if (!context.timeout)
                context.timeout = 5000;
            if (!context.method)
                context.method = 'GET';
            if (!context.headers)
                context.headers = {};
            if (!context.threads)
                context.threads = 3;
            if (!context.noThreadsSize)
                context.noThreadsSize = 500 * 1024;
            if (!context.range)
                context.range = '0-100';
            if (!context.metaSize)
                context.metaSize = 10 * 1024;
            context.runtime = {};
        }
        let mode = 1;
        if (fs_1.default.existsSync(context.mtdfile)) {
            if (context.overwrite) {
                fs_1.default.rmSync(context.mtdfile);
            }
            else {
                mode = 2;
            }
        }
        if (mode === 1) {
            this.addChild(new file_open_1.default());
            this.addChild(new head_request_1.default());
            this.addChild(new threads_generator_1.default());
            this.addChild(new meta_writer_1.default());
            this.addChild(new data_request_1.default());
            this.addChild(new file_close_1.default());
        }
        else if (mode === 2) {
            this.addChild(new file_open_1.default());
            this.addChild(new meta_reader_1.default());
            this.addChild(new data_request_1.default());
            this.addChild(new file_close_1.default());
        }
        return super.doStart(context);
    }
}
exports.Downloader = Downloader;
//# sourceMappingURL=downloader.js.map