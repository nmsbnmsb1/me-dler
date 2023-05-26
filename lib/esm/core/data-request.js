import { ErrHandler, Action, RunAll } from 'me-actions';
import ThreadsRequest from './threads-request';
import ThreadsTimeout from './threads-timeout';
export default class extends Action {
    async doStart(context) {
        this.timeout = new ThreadsTimeout().start(context).watch((a) => {
            if (a.isRejected())
                this.getRP().reject(a.getError());
        });
        this.request = new RunAll(ErrHandler.RejectAllDone);
        for (let thread of context.runtime.threads) {
            if (thread.position < thread.end)
                this.request.addChild(new ThreadsRequest(thread));
        }
        this.request.start(context).watch((a) => {
            if (a.isResolved())
                this.getRP().resolve();
            else if (a.isRejected())
                this.getRP().reject(a.getError());
        });
        await this.getRP().p;
    }
    doStop(context) {
        if (this.timeout)
            this.timeout.stop(context);
        if (this.request)
            this.request.stop(context);
        this.endRP();
    }
}
//# sourceMappingURL=data-request.js.map