import { RunQueue } from 'me-actions';
import type { DLContext } from './context';
import { Downloader } from './downloader';
export declare class DLQueue extends RunQueue {
    private static _ref;
    private static _instance;
    static ref(): DLQueue;
    static unref(): boolean;
    static getRef(): number;
    getDL: (context: DLContext) => Downloader;
}
