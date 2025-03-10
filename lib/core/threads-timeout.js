"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        let rp = this.getRP();
        let { metaData } = context;
        let totalBytesDownloaded = 0;
        this.timer = setInterval(() => {
            let bytesDownloaded = 0;
            for (let thread of metaData.threads)
                bytesDownloaded += thread.position - thread.start;
            if (bytesDownloaded > totalBytesDownloaded) {
                totalBytesDownloaded = bytesDownloaded;
            }
            else {
                rp.reject((0, utils_1.e)('req_time_out', context.timeout));
            }
        }, context.timeout);
        await rp.p;
    }
    async doStop() {
        if (this.timer)
            clearInterval(this.timer);
        this.timer = undefined;
    }
}
exports.default = default_1;
//# sourceMappingURL=threads-timeout.js.map