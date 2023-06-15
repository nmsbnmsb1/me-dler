"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        if (!context.errs)
            context.errs = [];
        if (context.mkdir === undefined)
            context.mkdir = true;
        if (context.overwrite === undefined)
            context.overwrite = false;
        if (context.writeErrFile === undefined)
            context.writeErrFile = true;
        if (context.skipHeadRequest === undefined)
            context.skipHeadRequest = false;
        if (!context.timeout)
            context.timeout = 10000;
        if (!context.method)
            context.method = 'GET';
        if (!context.headers)
            context.headers = {};
        if (!context.threads)
            context.threads = 3;
        if (!context.threadsLimit)
            context.threadsLimit = 500 * 1024;
        if (!context.range)
            context.range = '0-100';
        if (!context.metaSize)
            context.metaSize = 10 * 1024;
        context.metaData = { dlFile: `${context.file}.dl`, errFile: `${context.file}.err` };
        if (context.preloader) {
            await context.preloader(context);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=init-context.js.map