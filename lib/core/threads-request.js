"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        var _a, _b, _c, _d;
        let { metaData } = context;
        let headers = context.headers ? JSON.parse(JSON.stringify(context.headers)) : {};
        if (metaData.ddxc)
            headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
        try {
            (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'http', `${context.method.toUpperCase()}: ${metaData.url}`, this, this.context);
            (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'debug', `Using Head: ${JSON.stringify(headers)}`, this, this.context);
            this.response = await (0, utils_1.request)(context, {
                method: context.method,
                url: metaData.url,
                headers,
                timeout: context.timeout,
                responseType: 'stream',
            });
        }
        catch (err) {
            throw (0, utils_1.e)(context, 'data_failed', err.message, `${context.method.toUpperCase()}: ${metaData.url}`);
        }
        let rp = this.getRP();
        {
            this.lnMap.data = async (chunk) => {
                if (!this.isPending())
                    return;
                try {
                    let currentPosition = this.thread.position;
                    this.thread.position += chunk.length;
                    if (!metaData.ddxc) {
                        metaData.fileSize = this.thread.end = this.thread.position;
                    }
                    else {
                        if (this.thread.position > this.thread.end) {
                            this.thread.position = this.thread.end;
                        }
                    }
                    await metaData.dlHandle.write(chunk, 0, chunk.length, currentPosition);
                }
                catch (err) {
                    rp.reject((0, utils_1.e)(context, 'write_data_failed', this.thread.seq, metaData.dlFile));
                }
            };
            this.lnMap.error = (err) => {
                rp.reject((0, utils_1.e)(context, 'data_failed', err.message, `${context.method.toUpperCase()}: ${metaData.url}`));
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
        for (let k in this.lnMap) {
            (_d = (_c = this.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.off(k, this.lnMap[k]);
        }
        this.thread.done = err === undefined;
        await (0, meta_writer_1.writeMeta)(context);
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