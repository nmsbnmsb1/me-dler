"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.e = e;
let codes = {
    preload_failed: 'Preloader could not be processed. {0}',
    no_url: 'context.url hasnot been set.',
    no_file: 'context.file hasnot been set.',
    file_failed: 'File handler could not be created on path: {0}',
    read_meta_failed: 'MetaData could not be readed on path: {0}',
    req_time_out: 'Download request timed out after {0} seconds. Closing connections',
    data_failed: 'Data could not be downloaded caused by {0} from: {1}',
    write_meta_failed: 'MetaData could not be written on path: {0}',
    write_data_failed: 'Data could not be written on thread {0}, on path: {1}',
    dl_not_completed: 'Download did not complete successfully.',
    file_downloaded: 'File has been downloaded on path: {0}',
};
function e(context, code, ...cs) {
    let message = codes[code];
    if (cs.length > 0) {
        let list = message.split(/\{[0-9]\}/g);
        message = '';
        for (let i = 0; i < list.length; i++) {
            message = `${message}${list[i]}${cs[i] || ''}`;
        }
    }
    return new Error(message);
}
//# sourceMappingURL=errs.js.map