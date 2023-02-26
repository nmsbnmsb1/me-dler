import { Action } from 'me-actions';
export default class extends Action {
    async doStart({ dl }) {
        let s = dl.range.split('-');
        let start = Math.ceil((parseInt(s[0]) * dl.results.fileSize) / 100);
        let end = Math.ceil((parseInt(s[1]) * dl.results.fileSize) / 100);
        let total = dl.threads;
        if (dl.results.fileSize <= dl.oneThreadSize)
            total = 1;
        else if (!dl.results.acceptRanges)
            total = 1;
        let blockSize = Math.ceil((end - start) / total);
        let threads = [];
        let i = 0;
        let startRange = start;
        let endRange = start + blockSize;
        while (i < dl.threads) {
            threads.push({ start: startRange, end: endRange, position: startRange });
            i++;
            startRange = endRange + 1;
            endRange = blockSize * (i + 1);
        }
        threads[threads.length - 1].end += end - threads[threads.length - 1].end;
        dl.results.threads = threads;
    }
}
//# sourceMappingURL=threads-generator.js.map