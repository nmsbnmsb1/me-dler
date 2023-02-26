import { RunOne } from 'me-actions';
import { IDLContext } from './context';
export declare class Downloader extends RunOne {
    protected context: IDLContext;
    constructor(context: IDLContext);
    protected doStart(context: IDLContext): Promise<void>;
}
