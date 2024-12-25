import { Action, ErrHandler, RunAll } from 'me-actions';
import type { DLContext } from '../context';
import ThreadsRequest from './threads-request';
import ThreadsTimeout from './threads-timeout';

export default class extends Action {
	private timeout: ThreadsTimeout;
	private thread: Action;
	//
	protected async doStart(context: DLContext) {
		//
		this.timeout = new ThreadsTimeout().watch(() => {
			if (this.timeout.isRejected()) {
				this.getRP().reject(this.timeout.getError());
			}
		});
		this.timeout.start(context);
		//
		let { metaData } = context;
		if (metaData.threads.length <= 1) {
			this.thread = new ThreadsRequest(metaData.threads[0]);
		} else {
			let all = new RunAll(ErrHandler.RejectAllDone);
			for (let thread of metaData.threads) {
				if (!thread.done) {
					all.addChild(new ThreadsRequest(thread));
				}
			}
			this.thread = all;
		}
		this.thread.watch(() => {
			if (this.thread.isResolved()) {
				this.getRP().resolve();
			} else if (this.thread.isRejected()) {
				this.getRP().reject(this.thread.getError());
			}
		});
		this.thread.start(context);
		//
		await this.getRP().p;
	}

	protected async doStop(context: DLContext) {
		if (this.timeout) await this.timeout.stop(context);
		if (this.thread) await this.thread.stop(context);
	}
}
