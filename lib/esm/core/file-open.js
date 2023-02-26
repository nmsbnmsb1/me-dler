import path from 'path';
import fs from 'fs';
import { Action } from 'me-actions';
import e from '../errs';
export default class extends Action {
    async doStart({ dl }) {
        if (dl.mkdir && !fs.existsSync(path.dirname(dl.mtdfile)))
            fs.mkdirSync(path.dirname(dl.mtdfile));
        try {
            dl.results.fd = fs.openSync(dl.mtdfile, !fs.existsSync(dl.mtdfile) ? 'w+' : 'r+', undefined);
        }
        catch (err) {
            throw e(1007, dl.mtdfile);
        }
    }
}
//# sourceMappingURL=file-open.js.map