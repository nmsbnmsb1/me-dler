import fs from 'fs';
import { Action } from 'me-actions';
export function writeMeta(context) {
    let { runtime } = context;
    try {
        let meta = {
            fileSize: runtime.fileSize,
            url: runtime.url,
            threads: runtime.threads,
        };
        let buffer = Buffer.alloc(context.metaSize);
        buffer.fill(' ');
        let dataString = JSON.stringify(meta);
        buffer.write(dataString);
        let writePosition = runtime.fileSize;
        fs.writeSync(runtime.fileDescriptor, buffer, 0, buffer.length, writePosition);
    }
    catch (err) {
        throw err;
    }
}
export default class extends Action {
    async doStart(context) {
        writeMeta(context);
    }
}
//# sourceMappingURL=meta-writer.js.map