let error = 0;
let warning = 1;
let info = 2;
let codes = {
	no_url: {
		type: error,
		message: 'context.url hasnot been set.',
	},
	no_file: {
		type: error,
		message: 'context.file hasnot been set.',
	},
	file_failed: {
		type: error,
		message: 'File handle could not be created on path: {0}',
	},
	req_time_out: {
		type: error,
		message: 'Download request timed out after {0} seconds. Closing connections',
	},
	data_failed: {
		type: error,
		message: 'data could not be downloaded caused by {0} from: {1}',
	},
	write_meta_failed: {
		type: error,
		message: 'could not write meta data on path:  {0}',
	},
	not_completed: {
		type: error,
		message: 'Download did not complete successfully.',
	},
};

export function e(code: string, ...cs: any) {
	let item = codes[code];
	let message = item.message;

	if (cs.length > 0) {
		let list = message.split(/\{[0-9]\}/g);
		message = '';
		for (let i = 0; i < list.length; i++) {
			message = `${message}${list[i]}${cs[i] || ''}`;
		}
	}
	return new Error(message);
}
