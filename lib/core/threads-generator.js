"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const me_actions_1 = require("me-actions");
class default_1 extends me_actions_1.Action {
    async doStart(context) {
        let { metaData } = context;
        if (!metaData.ddxc) {
            metaData.threads = [{ seq: 0, start: 0, end: 0, position: 0, done: false }];
        }
        else {
            let s = context.range.split('-');
            let total = context.threads;
            if (metaData.fileSize <= context.threadsLimit || !metaData.acceptRanges)
                total = 1;
            let start = Math.ceil((parseInt(s[0]) * metaData.fileSize) / 100);
            let end = Math.ceil((parseInt(s[1]) * metaData.fileSize) / 100);
            let blockSize = Math.ceil((end - start) / total);
            let threads = [];
            let startRange = start;
            let endRange = start + blockSize;
            for (let i = 1; i <= total; i++) {
                threads.push({ seq: i - 1, start: startRange, end: endRange, position: startRange, done: false });
                startRange = endRange + 1;
                endRange = blockSize * (i + 1);
            }
            threads[threads.length - 1].end += end - threads[threads.length - 1].end;
            metaData.threads = threads;
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=threads-generator.js.map