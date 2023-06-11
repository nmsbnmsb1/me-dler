import fs from 'fs';
import { ActionForFunc, ErrHandler, RunOne } from 'me-actions';
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
        super(ErrHandler.RejectAllDone);
        this.context = context;
    }
    async doStart(context) {
        if (fs.existsSync(context.file))
            return;
        let one = new RunOne(ErrHandler.RejectImmediately);
        {
            one.addChild(new InitContext());
            one.addChild(new FileOpen());
            one.addChild(new MetaReader());
            one.addChild(new ActionForFunc(async () => {
                if (context.metaData.status) {
                    one.addChild(new HeadRequest());
                    one.addChild(new ThreadsGenerator());
                    one.addChild(new MetaWriter());
                }
                one.addChild(new DataRequest());
            }));
        }
        this.addChild(one);
        this.addChild(new FileClose());
        return super.doStart(context);
    }
}
//# sourceMappingURL=downloader.js.map