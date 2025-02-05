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
        let rp = this.getRP();
        this.timeout = new threads_timeout_1.default().watch(() => {
            if (this.timeout.isRejected()) {
                rp.reject(this.timeout.getError());
            }
        });
        this.timeout.start(context);
        let { metaData } = context;
        if (metaData.threads.length <= 1) {
            this.thread = new threads_request_1.default(metaData.threads[0]);
        }
        else {
            let all = new me_actions_1.RunAll(me_actions_1.ErrHandler.RejectAllDone);
            for (let thread of metaData.threads) {
                if (!thread.done) {
                    all.addChild(new threads_request_1.default(thread));
                }
            }
            this.thread = all;
        }
        this.thread.watch(() => {
            if (this.thread.isResolved()) {
                rp.resolve();
            }
            else if (this.thread.isRejected()) {
                rp.reject(this.thread.getError());
            }
        });
        this.thread.start(context);
        await rp.p;
    }
    async doStop(context) {
        if (this.timeout)
            await this.timeout.stop(context);
        if (this.thread)
            await this.thread.stop(context);
    }
}
exports.default = default_1;
//# sourceMappingURL=data-request.js.map