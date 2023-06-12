import { RunQueue } from 'me-actions';
import { IDLContext } from './context';
import { Downloader } from './downloader';
export declare class DLQueue extends RunQueue {
    private static _ref;
    private static _instance;
    static ref(): DLQueue;
    static unref(): void;
    getDL: (context: IDLContext) => Downloader;
}
