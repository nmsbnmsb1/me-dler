import { Action } from 'me-actions';
import { IDLContext } from '../context';
import e from '../errs';

export default class extends Action {
	private timer: any;

	protected async doStart({ dl }: IDLContext) {
		let { results } = dl;
		let totalBytesDownloaded = 0;
		this.timer = setInterval(() => {
			let bytesDownloaded = 0;
			for (let thread of results.threads) bytesDownloaded += thread.position - thread.start;
			if (bytesDownloaded > totalBytesDownloaded) {
				// All is well
				totalBytesDownloaded = bytesDownloaded;
				//
			} else {
				clearInterval(this.timer);
				this.timer = undefined;
				this.getRP().reject(e(1001, dl.timeout));
			}
		}, dl.timeout);
		//
		await this.getRP().p;
	}

	protected doStop() {
		if (this.timer) clearInterval(this.timer);
		this.timer = undefined;
		this.endRP();
	}
}
