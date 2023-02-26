import fs from 'fs';
import { Action } from 'me-actions';
export function writeMeta({ dl }) {
    let { results } = dl;
    try {
        let meta = {
            fileSize: results.fileSize,
            url: results.url,
            threads: results.threads,
        };
        let buffer = Buffer.alloc(dl.metaSize);
        buffer.fill(' ');
        let dataString = JSON.stringify(meta);
        buffer.write(dataString);
        let writePosition = results.fileSize;
        fs.writeSync(results.fd, buffer, 0, buffer.length, writePosition);
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