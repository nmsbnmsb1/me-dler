import fs from 'fs';
import { Action } from 'me-actions';
export default class extends Action {
    async doStart({ dl }) {
        let { results } = dl;
        try {
            let stats = fs.fstatSync(results.fd);
            let actualSize = stats.size;
            let readPostion = actualSize - dl.metaSize;
            let buffer = Buffer.alloc(dl.metaSize);
            fs.readSync(results.fd, buffer, 0, buffer.length, readPostion);
            let meta = JSON.parse(buffer.toString());
            results.fileSize = meta.fileSize;
            results.url = meta.url;
            results.threads = meta.threads;
        }
        catch (err) {
            throw err;
        }
    }
}
//# sourceMappingURL=meta-reader.js.map