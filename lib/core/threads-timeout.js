"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
const errs_1 = __importDefault(require("../errs"));
class default_1 extends me_actions_1.Action {
    async doStart({ dl }) {
        let { results } = dl;
        let totalBytesDownloaded = 0;
        this.timer = setInterval(() => {
            let bytesDownloaded = 0;
            for (let thread of results.threads)
                bytesDownloaded += thread.position - thread.start;
            if (bytesDownloaded > totalBytesDownloaded) {
                totalBytesDownloaded = bytesDownloaded;
            }
            else {
                clearInterval(this.timer);
                this.timer = undefined;
                this.getRP().reject((0, errs_1.default)(1001, dl.timeout));
            }
        }, dl.timeout);
        await this.getRP().p;
    }
    doStop() {
        if (this.timer)
            clearInterval(this.timer);
        this.timer = undefined;
        this.endRP();
    }
}
exports.default = default_1;
//# sourceMappingURL=threads-timeout.js.map