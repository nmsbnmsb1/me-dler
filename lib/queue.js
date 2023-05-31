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
    static setRunCount(runCount) {
        DLQueue.getInstance().setRunCount(runCount);
    }
    static getDL(context) {
        return new downloader_1.Downloader(context);
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
    static async doBatch(dls, errHandler = me_actions_1.ErrHandler.Ignore) {
        let instance = DLQueue.getInstance();
        let all = [];
        for (let dl of dls)
            all.push(instance.doOne(dl));
        await Promise.all(all);
        if (errHandler != me_actions_1.ErrHandler.Ignore) {
            for (let dl of dls) {
                if (dl.isRejected())
                    return dl.getError();
            }
        }
    }
}
exports.DLQueue = DLQueue;
//# sourceMappingURL=queue.js.map