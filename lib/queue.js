"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const me_actions_1 = require("me-actions");
const downloader_1 = require("./downloader");
class Queue extends me_actions_1.RunQueue {
    static getInstance() {
        if (!Queue._instance) {
            Queue._instance = new Queue(5, me_actions_1.RunQueue.StopHandlerManual, me_actions_1.ErrHandler.Ignore).start();
        }
        return Queue._instance;
    }
    static addOne(context) {
        let dl = new downloader_1.Downloader(context);
        Queue.getInstance().addChild(dl);
        return dl;
    }
    static async doDownloadOne(context) {
        return Queue.getInstance().doOne(new downloader_1.Downloader(context));
    }
    static stopDownloadOne(dl) {
        Queue.getInstance().stopOne(dl);
    }
    static batchDownload(ctxs) {
        let instance = Queue.getInstance();
        let dls = [];
        for (let ctx of ctxs) {
            let dl = new downloader_1.Downloader(ctx);
            instance.addChild(dl);
            dls.push(dl);
        }
        return dls;
    }
    static async doBatch(ctxs, errHandler = me_actions_1.ErrHandler.Ignore) {
        let instance = Queue.getInstance();
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
        let instance = Queue.getInstance();
        for (let dl of dls) {
            instance.stopOne(dl);
        }
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map