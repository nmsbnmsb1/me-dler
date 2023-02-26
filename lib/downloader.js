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
        let { dl } = context;
        if (fs_1.default.existsSync(dl.file))
            return;
        {
            dl.mtdfile = `${dl.file}.mtd`;
            if (dl.mkdir !== false)
                dl.mkdir = true;
            if (!dl.timeout)
                dl.timeout = 5000;
            if (!dl.method)
                dl.method = 'GET';
            if (!dl.headers)
                dl.headers = {};
            if (!dl.threads)
                dl.threads = 3;
            if (!dl.oneThreadSize)
                dl.oneThreadSize = 500 * 1024;
            if (!dl.range)
                dl.range = '0-100';
            if (!dl.metaSize)
                dl.metaSize = 10 * 1024;
            dl.results = {};
        }
        let mode = 1;
        if (fs_1.default.existsSync(dl.mtdfile)) {
            if (dl.overwrite)
                fs_1.default.rmSync(dl.mtdfile);
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