"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        let { runtime } = context;
        let totalBytesDownloaded = 0;
        this.timer = setInterval(() => {
            let bytesDownloaded = 0;
            for (let thread of runtime.threads)
                bytesDownloaded += thread.position - thread.start;
            if (bytesDownloaded > totalBytesDownloaded) {
                totalBytesDownloaded = bytesDownloaded;
            }
            else {
                clearInterval(this.timer);
                this.timer = undefined;
                this.getRP().reject((0, utils_1.e)(1001, context.timeout));
            }
        }, context.timeout);
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