import { Action } from 'me-actions';
import type { DLContext } from '../context';
import { e } from '../utils';

export default class extends Action {
	private timer: any;

	protected async doStart(context: DLContext) {
		let rp = this.getRP();
		let { metaData } = context;
		let totalBytesDownloaded = 0;
		//
		context.logger?.('debug', `Checking timeout: ${context.timeout}`, this, this.context);
		this.timer = setInterval(() => {
			let bytesDownloaded = 0;
			for (let thread of metaData.threads) bytesDownloaded += thread.position - thread.start;
			if (bytesDownloaded > totalBytesDownloaded) {
				// All is well
				totalBytesDownloaded = bytesDownloaded;
				//
			} else {
				//context.timeout 没有收到数据
				rp.reject(e(context, 'req_time_out', context.timeout));
			}
		}, context.timeout);
		//
		await rp.p;
	}

	protected async doStop() {
		if (this.timer) clearInterval(this.timer);
		this.timer = undefined;
	}
}
