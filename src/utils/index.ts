import fs from 'node:fs';

export * from './errs';
export * from './http';

const fnMap = new Map();
export const fsPromisify = (fn: any, ...args: any) => {
	let pfn = fnMap.get(fn);
	if (!pfn) {
		pfn = (...args: any) => {
			return new Promise((resolve, reject) => {
				fn.apply(fs, [
					...args,
					(err: any, res: any) => {
						if (err === true) {
							resolve(true);
						} else {
							!err ? resolve(res) : reject(err);
						}
					},
				]);
			});
		};
		fnMap.set(fn, pfn);
	}
	return pfn(...args);
};
