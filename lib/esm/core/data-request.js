import { Action, ErrHandler, RunAll } from 'me-actions';
import ThreadsRequest from './threads-request';
import ThreadsTimeout from './threads-timeout';
export default class extends Action {
    async doStart(context) {
        this.timeout = new ThreadsTimeout().watch(() => {
            if (this.timeout.isRejected()) {
                this.getRP().reject(this.timeout.getError());
            }
        });
        this.timeout.start(context);
        let { metaData } = context;
        if (metaData.threads.length <= 1) {
            this.thread = new ThreadsRequest(metaData.threads[0]);
        }
        else {
            let all = new RunAll(ErrHandler.RejectAllDone);
            for (let thread of metaData.threads) {
                if (!thread.done) {
                    all.addChild(new ThreadsRequest(thread));
                }
            }
            this.thread = all;
        }
        this.thread.watch(() => {
            if (this.thread.isResolved()) {
                this.getRP().resolve();
            }
            else if (this.thread.isRejected()) {
                this.getRP().reject(this.thread.getError());
            }
        });
        this.thread.start(context);
        await this.getRP().p;
    }
    async doStop(context) {
        if (this.timeout)
            await this.timeout.stop(context);
        if (this.thread)
            await this.thread.stop(context);
    }
}
//# sourceMappingURL=data-request.js.map