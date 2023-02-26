"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
const http_1 = require("../http");
const errs_1 = __importDefault(require("../errs"));
const meta_writer_1 = require("./meta-writer");
class default_1 extends me_actions_1.Action {
    constructor(thread) {
        super();
        this.thread = thread;
    }
    async doStart(context) {
        let { dl } = context;
        let { results } = dl;
        let headers = JSON.parse(JSON.stringify(dl.headers || {}));
        headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
        try {
            this.response = await (0, http_1.request)({ method: dl.method, url: results.url, headers, timeout: dl.timeout, responseType: 'stream' });
            this.onData = (chunk) => {
                if (!this.isPending())
                    return;
                try {
                    fs_1.default.writeSync(results.fd, chunk, 0, chunk.length, this.thread.position);
                    this.thread.position += chunk.length;
                    if (this.thread.position > this.thread.end)
                        this.thread.position = this.thread.end;
                    (0, meta_writer_1.writeMeta)(context);
                    if (this.thread.position >= this.thread.end)
                        this.getRP().resolve();
                }
                catch (err) {
                    this.getRP().reject(err);
                }
            };
            this.response.data.on('data', this.onData);
        }
        catch (err) {
            throw (0, errs_1.default)(1004, `${err}: ${dl.url}`);
        }
        await this.getRP().p;
    }
    doStop() {
        var _a, _b;
        (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.off('data', this.onData);
        this.endRP();
    }
}
exports.default = default_1;
//# sourceMappingURL=threads-request.js.map