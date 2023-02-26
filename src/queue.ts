import { ErrHandler, RunQueue } from 'me-actions';
import { IDLContext } from './context';
import { Downloader } from './downloader';

export class Queue extends RunQueue {
	private static _instance: Queue;

	public static getInstance() {
		if (!Queue._instance) {
			Queue._instance = new Queue(5, RunQueue.StopHandlerManual, ErrHandler.Ignore).start();
		}
		return Queue._instance;
	}

	public static addOne(context: IDLContext) {
		let dl = new Downloader(context);
		Queue.getInstance().addChild(dl);
		return dl;
	}
	public static async doDownloadOne(context: IDLContext) {
		return Queue.getInstance().doOne(new Downloader(context));
	}
	public static stopDownloadOne(dl: Downloader) {
		Queue.getInstance().stopOne(dl);
	}

	public static batchDownload(ctxs: IDLContext[]) {
		let instance = Queue.getInstance();
		let dls = [];
		for (let ctx of ctxs) {
			let dl = new Downloader(ctx);
			instance.addChild(dl);
			dls.push(dl);
		}
		return dls;
	}
	public static async doBatch(ctxs: IDLContext[], errHandler: number = ErrHandler.Ignore) {
		let instance = Queue.getInstance();
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
		let instance = Queue.getInstance();
		for (let dl of dls) {
			instance.stopOne(dl);
		}
	}
}
