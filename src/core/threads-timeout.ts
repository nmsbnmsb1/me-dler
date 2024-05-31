import { Action } from 'me-actions';
import { IDLContext } from '../context';
import { e } from '../utils';

export default class extends Action {
	private timer: any;

	protected async doStart(context: IDLContext) {
		let { metaData } = context;
		let totalBytesDownloaded = 0;
		//
		this.timer = setInterval(() => {
			let bytesDownloaded = 0;
			for (let thread of metaData.threads) bytesDownloaded += thread.position - thread.start;
			if (bytesDownloaded > totalBytesDownloaded) {
				// All is well
				totalBytesDownloaded = bytesDownloaded;
				//
			} else {
				//context.timeout 没有收到数据
				this.getRP().reject(e('req_time_out', context.timeout));
			}
		}, context.timeout);
		//
		await this.getRP().p;
	}

	protected async doStop() {
		if (this.timer) clearInterval(this.timer);
		this.timer = undefined;
	}
}
