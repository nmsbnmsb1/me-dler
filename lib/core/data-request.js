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
        let { dl } = context;
        this.timeout = new threads_timeout_1.default().start(context).watch((a) => {
            if (a.isRejected())
                this.getRP().reject(a.getError());
        });
        this.request = new me_actions_1.RunAll(me_actions_1.ErrHandler.RejectAllDone);
        for (let thread of dl.results.threads) {
            if (thread.position < thread.end)
                this.request.addChild(new threads_request_1.default(thread));
        }
        this.request.start(context).watch((a) => {
            if (a.isResolved())
                this.getRP().resolve();
            else if (a.isRejected())
                this.getRP().reject(a.getError());
        });
        await this.getRP().p;
    }
    doStop(context) {
        if (this.timeout)
            this.timeout.stop(context);
        if (this.request)
            this.request.stop(context);
        this.endRP();
    }
}
exports.default = default_1;
//# sourceMappingURL=data-request.js.map