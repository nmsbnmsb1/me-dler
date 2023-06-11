import { Action, ErrHandler, RunAll } from 'me-actions';
import ThreadsRequest from './threads-request';
import ThreadsTimeout from './threads-timeout';
export default class extends Action {
    async doStart(context) {
        this.timeout = new ThreadsTimeout().start(context).watch(() => {
            if (this.timeout.isRejected()) {
                this.endRP(true, 'timeout');
            }
        });
        let { metaData } = context;
        if (metaData.threads.length <= 1) {
            this.thread = new ThreadsRequest(metaData.threads[0]);
        }
        else {
            let all = new RunAll(ErrHandler.RejectAllDone);
            for (let thread of metaData.threads) {
                if (thread.position < thread.end) {
                    all.addChild(new ThreadsRequest(thread));
                }
            }
            this.thread = all;
        }
        this.thread.start(context).watch(() => {
            if (this.thread.isResolved()) {
                this.endRP(false);
            }
            else if (this.thread.isRejected()) {
                this.endRP(true, this.thread.getError());
            }
        });
        await this.getRP().p;
    }
    doStop(context) {
        if (this.timeout)
            this.timeout.stop(context);
        if (this.thread)
            this.thread.stop(context);
        this.endRP();
    }
}
//# sourceMappingURL=data-request.js.map