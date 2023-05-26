import { Action } from 'me-actions';
import { IDLContext } from '../context';

export default class extends Action {
	protected async doStart(context: IDLContext) {
		let s = context.range.split('-');
		//计算线程数量
		let total = context.threads;
		if (context.runtime.fileSize <= context.noThreadsSize) total = 1;
		else if (!context.runtime.acceptRanges) total = 1;
		//计算起始位置
		let start = Math.ceil((parseInt(s[0]) * context.runtime.fileSize) / 100); //0
		let end = Math.ceil((parseInt(s[1]) * context.runtime.fileSize) / 100); //1024
		let blockSize = Math.ceil((end - start) / total); //3/342
		//
		let threads = [];
		let startRange = start;
		let endRange = start + blockSize;
		for (let i = 0; i < total; i++) {
			threads.push({ start: startRange, end: endRange, position: startRange });
			//
			startRange = endRange + 1;
			endRange = blockSize * (i + 1);
		}
		threads[threads.length - 1].end += end - threads[threads.length - 1].end;
		//
		context.runtime.threads = threads;
	}
}
