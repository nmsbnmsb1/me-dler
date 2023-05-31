const path = require('path');
const { Downloader } = require('../lib');

(async () => {
	let context = {
		// url: 'http://img.177pica.com/uploads/2021/08a/00008-3.jpg',
		// file: path.resolve('./downloads/00008-3.jpg'),
		url: 'https://avistaz.to/images/screens/b/f/h/bfhnls8vf8i8.jpg',
		file: path.resolve('./downloads/bfhnls8vf8i8.jpg'),
		overwrite: true,
		threadsLimit: 50 * 1024,
		headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36' },
	};

	let dl = await new Downloader(context).startAsync();
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
