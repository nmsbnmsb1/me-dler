"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        let s = context.range.split('-');
        let total = context.threads;
        if (context.runtime.fileSize <= context.noThreadsSize)
            total = 1;
        else if (!context.runtime.acceptRanges)
            total = 1;
        let start = Math.ceil((parseInt(s[0]) * context.runtime.fileSize) / 100);
        let end = Math.ceil((parseInt(s[1]) * context.runtime.fileSize) / 100);
        let blockSize = Math.ceil((end - start) / total);
        let threads = [];
        let startRange = start;
        let endRange = start + blockSize;
        for (let i = 0; i < total; i++) {
            threads.push({ start: startRange, end: endRange, position: startRange });
            startRange = endRange + 1;
            endRange = blockSize * (i + 1);
        }
        threads[threads.length - 1].end += end - threads[threads.length - 1].end;
        context.runtime.threads = threads;
    }
}
exports.default = default_1;
//# sourceMappingURL=threads-generator.js.map