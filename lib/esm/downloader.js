import fs from 'fs';
import { ActionForFunc, ErrHandler, RunOne } from 'me-actions';
import { e } from './utils';
import InitContext from './core/init-context';
import FileOpen from './core/file-open';
import MetaReader from './core/meta-reader';
import HeadRequest from './core/head-request';
import ThreadsGenerator from './core/threads-generator';
import MetaWriter from './core/meta-writer';
import DataRequest from './core/data-request';
import FileClose from './core/file-close';
export class Downloader extends RunOne {
    constructor(context) {
        super(ErrHandler.RejectImmediately);
        this.context = context;
    }
    async doStart(context) {
        if (context.preloader) {
            await context.preloader(context);
        }
        if (!context.url)
            throw e('no_url');
        if (!context.file)
            throw e('no_file');
        if (!context.overwrite && fs.existsSync(context.file)) {
            return;
        }
        this.addChild(new InitContext());
        this.addChild(new FileOpen());
        this.addChild(new MetaReader());
        this.addChild(new ActionForFunc(async () => {
            if (context.metaData.status) {
                this.addChild(new HeadRequest());
                this.addChild(new ThreadsGenerator());
                this.addChild(new MetaWriter());
            }
            this.addChild(new DataRequest());
        }));
        this.watch(() => {
            return new FileClose().startAsync(context);
        });
        return super.doStart(context);
    }
}
//# sourceMappingURL=downloader.js.map