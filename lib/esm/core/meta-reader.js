import fs from 'fs';
import { Action } from 'me-actions';
export default class extends Action {
    async doStart(context) {
        let { metaData } = context;
        metaData.status = 'invalid';
        let stats = fs.fstatSync(metaData.dlDescriptor);
        let actualSize = stats.size;
        if (actualSize < context.metaSize) {
            return;
        }
        try {
            let readPostion = actualSize - context.metaSize;
            let buffer = Buffer.alloc(context.metaSize);
            fs.readSync(metaData.dlDescriptor, buffer, 0, buffer.length, readPostion);
            let meta = JSON.parse(buffer.toString());
            metaData.status = undefined;
            metaData.ddxc = meta.ddxc;
            metaData.url = meta.url;
            metaData.fileSize = meta.fileSize;
            metaData.threads = meta.threads;
            if (!meta.ddxc) {
                metaData.fileSize = 0;
                if (metaData.threads && metaData.threads[0]) {
                    metaData.threads[0].start = metaData.threads[0].end = metaData.threads[0].position = 0;
                    metaData.threads[0].done = false;
                }
            }
        }
        catch (err) {
        }
    }
}
//# sourceMappingURL=meta-reader.js.map