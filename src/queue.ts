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

	public static addOne(context: IDLContext) {
		let dl = new Downloader(context);
		DLQueue.getInstance().addChild(dl);
		return dl;
	}
	public static async doOne(context: IDLContext) {
		return DLQueue.getInstance().doOne(new Downloader(context));
	}
	public static stopOne(dl: Downloader) {
		DLQueue.getInstance().stopOne(dl);
	}

	public static batchDownload(ctxs: IDLContext[]) {
		let instance = DLQueue.getInstance();
		let dls = [];
		for (let ctx of ctxs) {
			let dl = new Downloader(ctx);
			instance.addChild(dl);
			dls.push(dl);
		}
		return dls;
	}
	public static async doBatch(ctxs: IDLContext[], errHandler: number = ErrHandler.Ignore) {
		let instance = DLQueue.getInstance();
		let all = [];
		for (let ctx of ctxs) all.push(instance.doOne(new Downloader(ctx)));
		//
		let dls = await Promise.all(all);
		if (errHandler != ErrHandler.Ignore) {
			for (let dl of dls) {
				if (dl.isRejected()) return dl.getError();
			}
		}
	}
	public static stopBatch(dls: Downloader[]) {
		let instance = DLQueue.getInstance();
		for (let dl of dls) {
			instance.stopOne(dl);
		}
	}
}
