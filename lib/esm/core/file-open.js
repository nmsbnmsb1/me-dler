import fs from 'fs';
import path from 'path';
import { Action } from 'me-actions';
import { e } from '../utils';
export default class extends Action {
    async doStart(context) {
        let { metaData } = context;
        if (context.overwrite && fs.existsSync(context.file)) {
            fs.unlinkSync(context.file);
        }
        let existsDLFile = fs.existsSync(metaData.dlFile);
        if (context.overwrite) {
            if (existsDLFile) {
                fs.unlinkSync(metaData.dlFile);
                existsDLFile = false;
            }
        }
        if (fs.existsSync(metaData.errFile)) {
            fs.unlinkSync(metaData.errFile);
        }
        if (context.mkdir) {
            let dir = path.dirname(metaData.dlFile);
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir);
        }
        try {
            metaData.dlDescriptor = fs.openSync(metaData.dlFile, !existsDLFile ? 'w+' : 'r+', undefined);
        }
        catch (err) {
            throw e('file_failed', metaData.dlFile);
        }
    }
}
//# sourceMappingURL=file-open.js.map