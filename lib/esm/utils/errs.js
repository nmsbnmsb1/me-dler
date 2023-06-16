let codes = {
    no_url: 'context.url hasnot been set.',
    no_file: 'context.file hasnot been set.',
    file_downloaded: 'File has been downloaded on path: {0}',
    file_failed: 'File handle could not be created on path: {0}',
    req_time_out: 'Download request timed out after {0} seconds. Closing connections',
    data_failed: 'data could not be downloaded caused by {0} from: {1}',
    write_meta_failed: 'could not write meta data on path:  {0}',
    dl_not_completed: 'Download did not complete successfully.',
};
export function e(code, ...cs) {
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