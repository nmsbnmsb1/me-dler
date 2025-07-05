"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a, _b, _c, _d, _e, _f;
        let { metaData } = context;
        metaData.status = 'invalid';
        let stats;
        try {
            stats = await metaData.dlHandle.stat();
        }
        catch (e) {
            (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'error', e.stack);
            throw e;
        }
        if (stats.size < context.metaSize) {
            (_b = context.logger) === null || _b === void 0 ? void 0 : _b.call(context, 'debug', `Metadata read failed: file size (${stats.size}) is smaller than required metadata size (${context.metaSize})`, this, this.context);
            return;
        }
        try {
            let readPostion = stats.size - context.metaSize;
            let buffer = Buffer.alloc(context.metaSize);
            await metaData.dlHandle.read(buffer, 0, buffer.length, readPostion);
            let meta = JSON.parse(buffer.toString());
            metaData.status = undefined;
            metaData.ddxc = meta.ddxc;
            metaData.url = meta.url;
            metaData.fileSize = meta.fileSize;
            metaData.threads = meta.threads;
            if (!meta.ddxc) {
                metaData.fileSize = 0;
                if (((_c = metaData.threads) === null || _c === void 0 ? void 0 : _c.length) > 1)
                    metaData.threads.length = 1;
                if ((_d = metaData.threads) === null || _d === void 0 ? void 0 : _d[0]) {
                    metaData.threads[0].start = metaData.threads[0].end = metaData.threads[0].position = 0;
                    metaData.threads[0].done = false;
                }
            }
            (_e = context.logger) === null || _e === void 0 ? void 0 : _e.call(context, 'debug', `MetaData readed: ${JSON.stringify(metaData)}`, this, this.context);
        }
        catch (err) {
            (_f = context.logger) === null || _f === void 0 ? void 0 : _f.call(context, 'error', `MetaData could not be readed on path: ${context.file}`, this, this.context);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=meta-reader.js.map