import { ErrHandler, RunQueue } from 'me-actions';
import { Downloader } from './downloader';
export class DLQueue extends RunQueue {
    constructor() {
        super(...arguments);
        this.getDL = (context) => new Downloader(context);
    }
    static ref() {
        DLQueue._ref++;
        if (!DLQueue._instance) {
            DLQueue._instance = new DLQueue(5, RunQueue.StopHandlerManual, ErrHandler.Ignore).start();
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
        }
    }
}
DLQueue._ref = 0;
//# sourceMappingURL=queue.js.map