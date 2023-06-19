const path = require('path');
const { Downloader } = require('../lib');

(async () => {
	let context = {
		// url: 'http://img.177pica.com/uploads/2021/08a/00008-3.jpg',
		// file: path.resolve('./downloads/00008-3.jpg'),
		url: 'https://www.sis001.com/bbs/attachment.php?aid=3733606&clickDownload=1&r=DkfvF',
		file: path.resolve('./downloads/aaa.txt'),
		overwrite: true,
		threads: 1,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
			Cookie: 'cdb2_sid=LSdmMl;cdb2_cookietime=2592000;cdb2_auth=lJ4Rf2CpqW4U81B0QqhmKPdUEz8muPkIIUeu5Zq5GwO2PMpHRUwyri8TUxVFlrrlbI%2BU81iWWfEnHmk',
		},
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
