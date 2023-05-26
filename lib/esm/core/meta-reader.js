import fs from 'fs';
import { Action } from 'me-actions';
export default class extends Action {
    async doStart(context) {
        let { runtime } = context;
        try {
            let stats = fs.fstatSync(runtime.fileDescriptor);
            let actualSize = stats.size;
            let readPostion = actualSize - context.metaSize;
            let buffer = Buffer.alloc(context.metaSize);
            fs.readSync(runtime.fileDescriptor, buffer, 0, buffer.length, readPostion);
            let meta = JSON.parse(buffer.toString());
            runtime.fileSize = meta.fileSize;
            runtime.url = meta.url;
            runtime.threads = meta.threads;
        }
        catch (err) {
            throw err;
        }
    }
}
//# sourceMappingURL=meta-reader.js.map