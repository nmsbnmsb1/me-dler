import { Action } from 'me-actions';
export default class extends Action {
    async doStart(context) {
        if (context.mkdir !== false)
            context.mkdir = true;
        if (context.overwrite !== true)
            context.overwrite = false;
        if (!context.timeout)
            context.timeout = 10000;
        if (!context.method)
            context.method = 'GET';
        if (!context.headers)
            context.headers = {};
        if (!context.threads)
            context.threads = 3;
        if (!context.threadsLimit)
            context.threadsLimit = 500 * 1024;
        if (!context.range)
            context.range = '0-100';
        if (!context.metaSize)
            context.metaSize = 10 * 1024;
        context.metaData = {
            dlFile: `${context.file}.dl`,
            errFile: `${context.file}.err`,
        };
    }
}
//# sourceMappingURL=init-context.js.map