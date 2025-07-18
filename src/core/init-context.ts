import { Action } from 'me-actions';

import type { DLContext, DLMetaData } from '../context';

export default class extends Action {
	protected async doStart(context: DLContext) {
		//base
		if (!context.errs) context.errs = [];
		//
		if (context.mkdir === undefined) context.mkdir = true;
		if (context.writeErrFile === undefined) context.writeErrFile = true;
		if (context.skipHeadRequest === undefined) context.skipHeadRequest = false;
		//
		if (!context.timeout) context.timeout = 10000;
		if (!context.method) context.method = 'GET';
		if (!context.headers) context.headers = {};
		if (!context.threads) context.threads = 3;
		if (!context.threadsLimit) context.threadsLimit = 500 * 1024;
		if (!context.range) context.range = '0-100';
		if (!context.metaSize) context.metaSize = 10 * 1024;
		//
		context.metaData = { dlFile: `${context.file}.dl`, errFile: `${context.file}.err` } as DLMetaData;
		context.logger?.('debug', `Initializing Context: ${JSON.stringify(context)}`, this, this.context);
	}
}
