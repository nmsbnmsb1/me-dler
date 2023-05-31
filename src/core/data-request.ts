import { ErrHandler, Action, RunAll } from 'me-actions';
import { IDLContext } from '../context';
import ThreadsRequest from './threads-request';
import ThreadsTimeout from './threads-timeout';

export default class extends Action {
	private timeout: ThreadsTimeout;
	private request: Action;

	protected async doStart(context: IDLContext) {
		this.timeout = new ThreadsTimeout().start(context).watch((a: Action) => {
			if (a.isRejected()) this.getRP().reject(a.getError());
		});
		//
		let { metaData } = context;
		if (metaData.threads.length <= 1) {
			this.request = new ThreadsRequest(metaData.threads[0]);
		} else {
			let runAll = new RunAll(ErrHandler.RejectAllDone);
			for (let thread of metaData.threads) {
				if (thread.position < thread.end) runAll.addChild(new ThreadsRequest(thread));
			}
			this.request = runAll;
		}
		this.request.start(context).watch((a: Action) => {
			if (a.isResolved()) this.getRP().resolve();
			else if (a.isRejected()) this.getRP().reject(a.getError());
		});
		//
		await this.getRP().p;
	}

	protected doStop(context: IDLContext) {
		if (this.timeout) this.timeout.stop(context);
		if (this.request) this.request.stop(context);
		this.endRP();
	}
}
