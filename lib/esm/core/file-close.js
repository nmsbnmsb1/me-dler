import fs from 'fs';
import { Action } from 'me-actions';
import e from '../errs';
export default class extends Action {
    async doStart({ dl }) {
        let { results } = dl;
        let isCompleted = true;
        for (let thread of results.threads) {
            if (thread.position < thread.end) {
                isCompleted = false;
                break;
            }
        }
        if (!isCompleted)
            throw e(1013);
        fs.ftruncateSync(results.fd, results.fileSize);
        fs.closeSync(results.fd);
        fs.renameSync(dl.mtdfile, dl.file);
    }
}
//# sourceMappingURL=file-close.js.map