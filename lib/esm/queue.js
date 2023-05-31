import { ErrHandler, RunQueue } from 'me-actions';
import { Downloader } from './downloader';
export class DLQueue extends RunQueue {
    static getInstance() {
        if (!DLQueue._instance) {
            DLQueue._instance = new DLQueue(5, RunQueue.StopHandlerManual, ErrHandler.Ignore).start();
        }
        return DLQueue._instance;
    }
    static setRunCount(runCount) {
        DLQueue.getInstance().setRunCount(runCount);
    }
    static getDL(context) {
        return new Downloader(context);
    }
    static addOne(dl) {
        DLQueue.getInstance().addChild(dl);
    }
    static stopOne(dl) {
        DLQueue.getInstance().stopOne(dl);
    }
    static async doOne(dl) {
        return DLQueue.getInstance().doOne(dl);
    }
    static batchDownload(dls) {
        let instance = DLQueue.getInstance();
        for (let dl of dls) {
            instance.addChild(dl);
        }
    }
    static stopBatch(dls) {
        let instance = DLQueue.getInstance();
        for (let dl of dls) {
            instance.stopOne(dl);
        }
    }
    static async doBatch(dls, errHandler = ErrHandler.Ignore) {
        let instance = DLQueue.getInstance();
        let all = [];
        for (let dl of dls)
            all.push(instance.doOne(dl));
        await Promise.all(all);
        if (errHandler != ErrHandler.Ignore) {
            for (let dl of dls) {
                if (dl.isRejected())
                    return dl.getError();
            }
        }
    }
}
//# sourceMappingURL=queue.js.map