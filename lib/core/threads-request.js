"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
const meta_writer_1 = require("./meta-writer");
class default_1 extends me_actions_1.Action {
    constructor(thread) {
        super();
        this.thread = thread;
        this.lnMap = {};
    }
    async doStart(context) {
        var _a, _b;
        let { metaData } = context;
        let headers = context.headers ? JSON.parse(JSON.stringify(context.headers)) : {};
        if (metaData.ddxc)
            headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
        {
            try {
                this.response = await (0, utils_1.request)({
                    method: context.method,
                    url: metaData.url,
                    headers,
                    timeout: context.timeout,
                    responseType: 'stream',
                });
            }
            catch (err) {
                throw (0, utils_1.e)('data_failed', err.message, `${context.method.toUpperCase()}: ${metaData.url}`);
            }
        }
        let rp = this.getRP();
        {
            this.lnMap.data = (chunk) => {
                if (!this.isPending())
                    return;
                try {
                    node_fs_1.default.writeSync(metaData.dlDescriptor, chunk, 0, chunk.length, this.thread.position);
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
                    rp.reject(err);
                }
            };
            this.lnMap.error = (err) => {
                rp.reject(err);
            };
            this.lnMap.end = () => {
                rp.resolve();
            };
            for (let k in this.lnMap) {
                this.response.data.on(k, this.lnMap[k]);
            }
        }
        let err;
        try {
            await rp.p;
        }
        catch (e) {
            err = e;
        }
        {
            for (let k in this.lnMap) {
                (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.off(k, this.lnMap[k]);
            }
        }
        this.thread.done = err === undefined;
        (0, meta_writer_1.writeMeta)(context);
        if (err)
            throw err;
    }
    async doStop() {
        var _a, _b;
        for (let k in this.lnMap) {
            (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.off(k, this.lnMap[k]);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=threads-request.js.map