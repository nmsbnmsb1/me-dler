import fs from 'fs';
import path from 'path';
import { Action } from 'me-actions';
import { e } from '../utils';
export default class extends Action {
    async doStart(context) {
        if (context.mkdir && !fs.existsSync(path.dirname(context.mtdfile))) {
            fs.mkdirSync(path.dirname(context.mtdfile));
        }
        try {
            context.runtime.fileDescriptor = fs.openSync(context.mtdfile, !fs.existsSync(context.mtdfile) ? 'w+' : 'r+', undefined);
        }
        catch (err) {
            throw e(1007, context.mtdfile);
        }
    }
}
//# sourceMappingURL=file-open.js.map