import fsPromises from 'node:fs/promises';

export * from './errs';
export * from './http';

export async function getFileType(p: string): Promise<'not-exist' | 'file' | 'directory'> {
	try {
		const stats = await fsPromises.lstat(p);
		return stats.isDirectory() ? 'directory' : 'file';
	} catch (err) {
		if (err.code === 'ENOENT') return 'not-exist';
		throw err;
	}
}
export async function isExists(p: string) {
	let fileType = await getFileType(p);
	if (fileType === 'not-exist') return false;
	return true;
}
