import { RunOne } from 'me-actions';
import type { DLContext } from './context';
export declare class Downloader extends RunOne {
    protected context: DLContext;
    constructor(context: DLContext);
    protected doStart(context: DLContext): Promise<void>;
}
