"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DLQueue = void 0;
const me_actions_1 = require("me-actions");
const downloader_1 = require("./downloader");
class DLQueue extends me_actions_1.RunQueue {
    constructor() {
        super(...arguments);
        this.getDL = (context) => new downloader_1.Downloader(context);
    }
    static ref() {
        DLQueue._ref++;
        if (!DLQueue._instance) {
            DLQueue._instance = new DLQueue(5, me_actions_1.RunQueue.StopHandlerManual, me_actions_1.ErrHandler.Ignore);
            DLQueue._instance.start();
        }
        return DLQueue._instance;
    }
    static unref() {
        DLQueue._ref--;
        if (DLQueue._ref <= 0) {
            if (DLQueue._instance) {
                DLQueue._instance.stop();
                DLQueue._instance = undefined;
            }
            return true;
        }
        return false;
    }
    static getRef() {
        return DLQueue._ref;
    }
}
exports.DLQueue = DLQueue;
DLQueue._ref = 0;
//# sourceMappingURL=queue.js.map