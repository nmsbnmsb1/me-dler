"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
const threads_request_1 = __importDefault(require("./threads-request"));
const threads_timeout_1 = __importDefault(require("./threads-timeout"));
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        this.timeout = new threads_timeout_1.default().start(context).watch(() => {
            if (this.timeout.isRejected()) {
                this.endRP(true, 'timeout');
            }
        });
        let { metaData } = context;
        if (metaData.threads.length <= 1) {
            this.thread = new threads_request_1.default(metaData.threads[0]);
        }
        else {
            let all = new me_actions_1.RunAll(me_actions_1.ErrHandler.RejectAllDone);
            for (let thread of metaData.threads) {
                if (thread.position < thread.end) {
                    all.addChild(new threads_request_1.default(thread));
                }
            }
            this.thread = all;
        }
        this.thread.start(context).watch(() => {
            if (this.thread.isResolved()) {
                this.endRP(false);
            }
            else if (this.thread.isRejected()) {
                this.endRP(true, this.thread.getError());
            }
        });
        await this.getRP().p;
    }
    doStop(context) {
        if (this.timeout)
            this.timeout.stop(context);
        if (this.thread)
            this.thread.stop(context);
        this.endRP();
    }
}
exports.default = default_1;
//# sourceMappingURL=data-request.js.map