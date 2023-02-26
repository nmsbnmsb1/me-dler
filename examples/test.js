const path = require('path');
const { Downloader } = require('../lib/downloader');

(async () => {
	let context = {
		dl: {
			url: 'https://xxx',
			file: path.resolve('./downloads/1578246360.fst.AJ3.png'),
			overwrite: true,
			headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' },
		},
	};

	let dl = await new Downloader(context).startAsync();
	console.log(dl);
	//
	// let fd = fs.openSync(`${context.dl.file}.mtd`, 'r+');
	// let stats = fs.fstatSync(fd);
	// let actualSize = stats.size;
	// let readPostion = actualSize - 10240;
	// let buffer = Buffer.alloc(10240);
	// fs.readSync(fd, buffer, 0, buffer.length, readPostion);
	// //
	// console.log(buffer);
	// let meta = JSON.parse(buffer.toString());
	// console.log(meta);
})();
