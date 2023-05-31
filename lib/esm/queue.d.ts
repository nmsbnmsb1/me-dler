import { RunQueue } from 'me-actions';
import { IDLContext } from './context';
import { Downloader } from './downloader';
export declare class DLQueue extends RunQueue {
    private static _instance;
    static getInstance(): DLQueue;
    static setRunCount(runCount: number): void;
    static getDL(context: IDLContext): Downloader;
    static addOne(dl: Downloader): void;
    static stopOne(dl: Downloader): void;
    static doOne(dl: Downloader): Promise<import("me-actions").Action>;
    static batchDownload(dls: Downloader[]): void;
    static stopBatch(dls: Downloader[]): void;
    static doBatch(dls: Downloader[], errHandler?: number): Promise<Error>;
}
