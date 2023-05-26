import { RunQueue } from 'me-actions';
import { IDLContext } from './context';
import { Downloader } from './downloader';
export declare class DLQueue extends RunQueue {
    private static _instance;
    static getInstance(): DLQueue;
    static addOne(context: IDLContext): Downloader;
    static doOne(context: IDLContext): Promise<import("me-actions").Action>;
    static stopOne(dl: Downloader): void;
    static batchDownload(ctxs: IDLContext[]): Downloader[];
    static doBatch(ctxs: IDLContext[], errHandler?: number): Promise<Error>;
    static stopBatch(dls: Downloader[]): void;
}
