import type { ActionContext } from 'me-actions';
import { Downloader } from './downloader';
export interface DLThread {
    start: number;
    end: number;
    position: number;
    done: boolean;
}
export interface DLMetaData {
    dlFile: string;
    dlDescriptor: number;
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
    overwrite?: boolean;
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
}
