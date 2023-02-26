import { RunQueue } from 'me-actions';
import { IDLContext } from './context';
import { Downloader } from './downloader';
export declare class Queue extends RunQueue {
    private static _instance;
    static getInstance(): Queue;
    static addOne(context: IDLContext): Downloader;
    static doDownloadOne(context: IDLContext): Promise<import("me-actions").Action>;
    static stopDownloadOne(dl: Downloader): void;
    static batchDownload(ctxs: IDLContext[]): Downloader[];
    static doBatch(ctxs: IDLContext[], errHandler?: number): Promise<Error>;
    static stopBatch(dls: Downloader[]): void;
}
