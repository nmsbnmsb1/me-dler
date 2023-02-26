import fs from 'fs';
import { Action } from 'me-actions';
import { request } from '../http';
import e from '../errs';
import { writeMeta } from './meta-writer';
export default class extends Action {
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
            this.response = await request({ method: dl.method, url: results.url, headers, timeout: dl.timeout, responseType: 'stream' });
            this.onData = (chunk) => {
                if (!this.isPending())
                    return;
                try {
                    fs.writeSync(results.fd, chunk, 0, chunk.length, this.thread.position);
                    this.thread.position += chunk.length;
                    if (this.thread.position > this.thread.end)
                        this.thread.position = this.thread.end;
                    writeMeta(context);
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
            throw e(1004, `${err}: ${dl.url}`);
        }
        await this.getRP().p;
    }
    doStop() {
        var _a, _b;
        (_b = (_a = this.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.off('data', this.onData);
        this.endRP();
    }
}
//# sourceMappingURL=threads-request.js.map