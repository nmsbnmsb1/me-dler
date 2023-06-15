import { Action } from 'me-actions';
import { e } from '../utils';
export default class extends Action {
    async doStart(context) {
        let { metaData } = context;
        let totalBytesDownloaded = 0;
        this.timer = setInterval(() => {
            let bytesDownloaded = 0;
            for (let thread of metaData.threads)
                bytesDownloaded += thread.position - thread.start;
            if (bytesDownloaded > totalBytesDownloaded) {
                totalBytesDownloaded = bytesDownloaded;
            }
            else {
                this.getRP().reject(e('req_time_out', context.timeout));
            }
        }, context.timeout);
        await this.getRP().p;
    }
    doStop() {
        if (this.timer)
            clearInterval(this.timer);
        this.timer = undefined;
    }
}
//# sourceMappingURL=threads-timeout.js.map