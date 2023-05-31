import { ErrHandler, RunQueue } from 'me-actions';
import { IDLContext } from './context';
import { Downloader } from './downloader';

export class DLQueue extends RunQueue {
	private static _instance: DLQueue;

	public static getInstance() {
		if (!DLQueue._instance) {
			DLQueue._instance = new DLQueue(5, RunQueue.StopHandlerManual, ErrHandler.Ignore).start();
		}
		return DLQueue._instance;
	}
	//
	public static setRunCount(runCount: number) {
		DLQueue.getInstance().setRunCount(runCount);
	}
	public static getDL(context: IDLContext) {
		return new Downloader(context);
	}
	//
	public static addOne(dl: Downloader) {
		DLQueue.getInstance().addChild(dl);
	}
	public static stopOne(dl: Downloader) {
		DLQueue.getInstance().stopOne(dl);
	}
	public static async doOne(dl: Downloader) {
		return DLQueue.getInstance().doOne(dl);
	}
	//
	public static batchDownload(dls: Downloader[]) {
		let instance = DLQueue.getInstance();
		for (let dl of dls) {
			instance.addChild(dl);
		}
	}
	public static stopBatch(dls: Downloader[]) {
		let instance = DLQueue.getInstance();
		for (let dl of dls) {
			instance.stopOne(dl);
		}
	}
	public static async doBatch(dls: Downloader[], errHandler: number = ErrHandler.Ignore) {
		let instance = DLQueue.getInstance();
		let all = [];
		for (let dl of dls) all.push(instance.doOne(dl));
		//
		await Promise.all(all);
		if (errHandler != ErrHandler.Ignore) {
			for (let dl of dls) {
				if (dl.isRejected()) return dl.getError();
			}
		}
	}
}
