import fs from 'fs';
import { Action } from 'me-actions';
import { e, request } from '../utils';
import { writeMeta } from './meta-writer';
export default class extends Action {
    constructor(thread) {
        super();
        this.thread = thread;
    }
    async doStart(context) {
        let { metaData } = context;
        let headers = context.headers ? JSON.parse(JSON.stringify(context.headers)) : {};
        if (metaData.ddxc)
            headers.range = `bytes=${this.thread.position}-${this.thread.end}`;
        try {
            this.response = await request({
                method: context.method,
                url: metaData.url,
                headers,
                timeout: context.timeout,
                responseType: 'stream',
            });
        }
        catch (err) {
            throw e(1002, err.message, `${context.method.toUpperCase()}: ${metaData.url}`);
        }
        this.onData = (chunk) => {
            if (!this.isPending())
                return;
            try {
                fs.writeSync(metaData.dlDescriptor, chunk, 0, chunk.length, this.thread.position);
                this.thread.position += chunk.length;
                if (!metaData.ddxc) {
                    metaData.fileSize = this.thread.end = this.thread.position;
                    writeMeta(context);
                }
                else {
                    if (this.thread.position > this.thread.end)
                        this.thread.position = this.thread.end;
                    writeMeta(context);
                    if (this.thread.position >= this.thread.end) {
                        this.endRP(false);
                    }
                }
            }
            catch (err) {
                this.endRP(true, err);
            }
        };
        this.onEnd = () => {
            this.endRP(false);
        };
        this.response.data.on('data', this.onData);
        this.response.data.on('end', this.onEnd);
        await this.getRP().p;
    }
    doStop() {
        var _a, _b, _c, _d;
        (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.off('data', this.onData);
        (_d = (_c = this.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.off('end', this.onEnd);
        this.endRP();
    }
}
//# sourceMappingURL=threads-request.js.map