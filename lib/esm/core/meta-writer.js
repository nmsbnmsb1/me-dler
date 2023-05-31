import fs from 'fs';
import { Action } from 'me-actions';
import { e } from '../utils';
export function writeMeta(context) {
    let { metaData } = context;
    try {
        let meta = {
            ddxc: metaData.ddxc,
            url: metaData.url,
            fileSize: metaData.fileSize,
            threads: metaData.threads,
        };
        let buffer = Buffer.alloc(context.metaSize);
        buffer.fill(' ');
        let dataString = JSON.stringify(meta);
        buffer.write(dataString);
        let writePosition = metaData.fileSize;
        fs.writeSync(metaData.dlDescriptor, buffer, 0, buffer.length, writePosition);
    }
    catch (err) {
        throw e(1003, metaData.dlFile);
    }
}
export default class extends Action {
    async doStart(context) {
        writeMeta(context);
    }
}
//# sourceMappingURL=meta-writer.js.map