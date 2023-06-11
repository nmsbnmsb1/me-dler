"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.e = void 0;
let error = 0;
let warning = 1;
let info = 2;
let codes = {
    1000: {
        type: error,
        message: 'Download request timed out after {0} seconds. Closing connections',
    },
    1001: {
        type: error,
        message: 'File handle could not be created on path: {0}',
    },
    1002: {
        type: error,
        message: 'data could not be downloaded caused by {0} from: {1}',
    },
    1003: {
        type: error,
        message: 'could not write meta data on path:  {0}',
    },
    1010: {
        type: error,
        message: 'Download did not complete successfully.',
    },
};
function e(code, ...cs) {
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
exports.e = e;
//# sourceMappingURL=errs.js.map