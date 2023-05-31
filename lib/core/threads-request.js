"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
const meta_writer_1 = require("./meta-writer");
class default_1 extends me_actions_1.Action {
    constructor(thread) {
        super();
        this.thread = thread;
    }
    async doStart(context) {
        let { metaData } = context;
        let headers = context.headers ? JSON.parse(JSON.stringify(context.headers)) : {};
        if (!metaData.ddxc) {
            headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
        }
        try {
            this.response = await (0, utils_1.request)({
                method: context.method,
                url: metaData.url,
                headers,
                timeout: context.timeout,
                responseType: 'stream',
            });
            this.onData = (chunk) => {
                if (!this.isPending())
                    return;
                try {
                    fs_1.default.writeSync(metaData.dlDescriptor, chunk, 0, chunk.length, this.thread.position);
                    this.thread.position += chunk.length;
                    if (!metaData.ddxc) {
                        metaData.fileSize = this.thread.end = this.thread.position;
                    }
                    else {
                        if (this.thread.position > this.thread.end) {
                            this.thread.position = this.thread.end;
                        }
                    }
                    (0, meta_writer_1.writeMeta)(context);
                }
                catch (err) {
                    this.getRP().reject(err);
                }
            };
            this.response.data.on('data', this.onData);
            this.onEnd = () => {
                this.getRP().resolve();
            };
            this.response.data.on('end', this.onEnd);
        }
        catch (err) {
            throw (0, utils_1.e)(1002, `${err}: ${context.url}`);
        }
        await this.getRP().p;
    }
    doStop() {
        var _a, _b, _c, _d;
        (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.off('data', this.onData);
        (_d = (_c = this.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.off('end', this.onEnd);
        this.endRP();
    }
}
exports.default = default_1;
//# sourceMappingURL=threads-request.js.map