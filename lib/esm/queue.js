import { ErrHandler, RunQueue } from 'me-actions';
import { Downloader } from './downloader';
export class DLQueue extends RunQueue {
    static getInstance() {
        if (!DLQueue._instance) {
            DLQueue._instance = new DLQueue(5, RunQueue.StopHandlerManual, ErrHandler.Ignore).start();
        }
        return DLQueue._instance;
    }
    static addOne(context) {
        let dl = new Downloader(context);
        DLQueue.getInstance().addChild(dl);
        return dl;
    }
    static async doOne(context) {
        return DLQueue.getInstance().doOne(new Downloader(context));
    }
    static stopOne(dl) {
        DLQueue.getInstance().stopOne(dl);
    }
    static batchDownload(ctxs) {
        let instance = DLQueue.getInstance();
        let dls = [];
        for (let ctx of ctxs) {
            let dl = new Downloader(ctx);
            instance.addChild(dl);
            dls.push(dl);
        }
        return dls;
    }
    static async doBatch(ctxs, errHandler = ErrHandler.Ignore) {
        let instance = DLQueue.getInstance();
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
        let instance = DLQueue.getInstance();
        for (let dl of dls) {
            instance.stopOne(dl);
        }
    }
}
//# sourceMappingURL=queue.js.map