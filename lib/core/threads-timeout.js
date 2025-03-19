"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
const utils_1 = require("../utils");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        var _a;
        let rp = this.getRP();
        let { metaData } = context;
        let totalBytesDownloaded = 0;
        (_a = context.logger) === null || _a === void 0 ? void 0 : _a.call(context, 'debug', `Checking timeout: ${context.timeout}`, this, this.context);
        this.timer = setInterval(() => {
            let bytesDownloaded = 0;
            for (let thread of metaData.threads)
                bytesDownloaded += thread.position - thread.start;
            if (bytesDownloaded > totalBytesDownloaded) {
                totalBytesDownloaded = bytesDownloaded;
            }
            else {
                rp.reject((0, utils_1.e)(context, 'req_time_out', context.timeout));
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