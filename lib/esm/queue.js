import { ErrHandler, RunQueue } from 'me-actions';
import { Downloader } from './downloader';
export class Queue extends RunQueue {
    static getInstance() {
        if (!Queue._instance) {
            Queue._instance = new Queue(5, RunQueue.StopHandlerManual, ErrHandler.Ignore).start();
        }
        return Queue._instance;
    }
    static addOne(context) {
        let dl = new Downloader(context);
        Queue.getInstance().addChild(dl);
        return dl;
    }
    static async doDownloadOne(context) {
        return Queue.getInstance().doOne(new Downloader(context));
    }
    static stopDownloadOne(dl) {
        Queue.getInstance().stopOne(dl);
    }
    static batchDownload(ctxs) {
        let instance = Queue.getInstance();
        let dls = [];
        for (let ctx of ctxs) {
            let dl = new Downloader(ctx);
            instance.addChild(dl);
            dls.push(dl);
        }
        return dls;
    }
    static async doBatch(ctxs, errHandler = ErrHandler.Ignore) {
        let instance = Queue.getInstance();
        let all = [];
        for (let ctx of ctxs)
            all.push(instance.doOne(new Downloader(ctx)));
        let dls = await Promise.all(all);
        if (errHandler != ErrHandler.Ignore) {
            for (let dl of dls) {
                if (dl.isRejected())
                    return dl.getError();
            }
        }
    }
    static stopBatch(dls) {
        let instance = Queue.getInstance();
        for (let dl of dls) {
            instance.stopOne(dl);
        }
    }
}
//# sourceMappingURL=queue.js.map