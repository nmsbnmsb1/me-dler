import fsPromises from 'node:fs/promises';
import type { ActionContext } from 'me-actions';
import { Downloader } from './downloader';
export interface DLThread {
    seq: number;
    start: number;
    end: number;
    position: number;
    done: boolean;
}
export interface DLMetaData {
    dlFile: string;
    dlHandle: fsPromises.FileHandle;
    errFile: string;
    status: string;
    ddxc: boolean;
    url: string;
    acceptRanges: boolean;
    fileSize: number;
    threads: DLThread[];
    err?: Error;
}
export interface DLContext extends ActionContext {
    preloader?: (caller: Downloader, context: DLContext) => Promise<any>;
    url?: string;
    file?: string;
    mkdir?: boolean;
    overwrite?: 'all' | 'dl';
    writeErrFile?: boolean;
    skipHeadRequest?: boolean;
    proxy?: string;
    timeout?: number;
    method?: string;
    headers?: {
        [name: string]: any;
    };
    threads?: number;
    threadsLimit?: number;
    range?: string;
    metaSize?: number;
    metaData?: DLMetaData;
    hasDown?: boolean;
    postloader?: (caller: Downloader, context: DLContext) => Promise<any>;
}
