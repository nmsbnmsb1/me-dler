import { Action } from 'me-actions';
export default class extends Action {
    async doStart(context) {
        let { metaData } = context;
        if (!metaData.ddxc) {
            metaData.threads = [{ start: 0, end: 0, position: 0 }];
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
                threads.push({ start: startRange, end: endRange, position: startRange });
                startRange = endRange + 1;
                endRange = blockSize * (i + 1);
            }
            threads[threads.length - 1].end += end - threads[threads.length - 1].end;
            metaData.threads = threads;
        }
    }
}
//# sourceMappingURL=threads-generator.js.map