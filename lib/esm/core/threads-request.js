import fs from 'fs';
import { Action } from 'me-actions';
import { e, request } from '../utils';
import { writeMeta } from './meta-writer';
export default class extends Action {
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
                this.response = await request({ method: context.method, url: metaData.url, headers, timeout: context.timeout, responseType: 'stream' });
            }
            catch (err) {
                throw e('data_failed', err.message, `${context.method.toUpperCase()}: ${metaData.url}`);
            }
        }
        {
            this.lnMap.data = (chunk) => {
                if (!this.isPending())
                    return;
                try {
                    fs.writeSync(metaData.dlDescriptor, chunk, 0, chunk.length, this.thread.position);
                    this.thread.position += chunk.length;
                    if (!metaData.ddxc) {
                        metaData.fileSize = this.thread.end = this.thread.position;
                    }
                    else {
                        if (this.thread.position > this.thread.end) {
                            this.thread.position = this.thread.end;
                        }
                    }
                    writeMeta(context);
                }
                catch (err) {
                    this.getRP().reject(err);
                }
            };
            this.lnMap.error = (err) => {
                this.getRP().reject(err);
            };
            this.lnMap.end = () => {
                this.getRP().resolve();
            };
            for (let k in this.lnMap) {
                this.response.data.on(k, this.lnMap[k]);
            }
        }
        let err;
        {
            try {
                await this.getRP().p;
            }
            catch (e) {
                err = e;
            }
        }
        {
            for (let k in this.lnMap) {
                (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.off(k, this.lnMap[k]);
            }
        }
        this.thread.done = err === undefined;
        writeMeta(context);
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
//# sourceMappingURL=threads-request.js.map