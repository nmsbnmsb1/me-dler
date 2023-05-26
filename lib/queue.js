"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DLQueue = void 0;
const me_actions_1 = require("me-actions");
const downloader_1 = require("./downloader");
class DLQueue extends me_actions_1.RunQueue {
    static getInstance() {
        if (!DLQueue._instance) {
            DLQueue._instance = new DLQueue(5, me_actions_1.RunQueue.StopHandlerManual, me_actions_1.ErrHandler.Ignore).start();
        }
        return DLQueue._instance;
    }
    static addOne(context) {
        let dl = new downloader_1.Downloader(context);
        DLQueue.getInstance().addChild(dl);
        return dl;
    }
    static async doOne(context) {
        return DLQueue.getInstance().doOne(new downloader_1.Downloader(context));
    }
    static stopOne(dl) {
        DLQueue.getInstance().stopOne(dl);
    }
    static batchDownload(ctxs) {
        let instance = DLQueue.getInstance();
        let dls = [];
        for (let ctx of ctxs) {
            let dl = new downloader_1.Downloader(ctx);
            instance.addChild(dl);
            dls.push(dl);
        }
        return dls;
    }
    static async doBatch(ctxs, errHandler = me_actions_1.ErrHandler.Ignore) {
        let instance = DLQueue.getInstance();
        let all = [];
        for (let ctx of ctxs)
            all.push(instance.doOne(new downloader_1.Downloader(ctx)));
        let dls = await Promise.all(all);
        if (errHandler != me_actions_1.ErrHandler.Ignore) {
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
exports.DLQueue = DLQueue;
//# sourceMappingURL=queue.js.map