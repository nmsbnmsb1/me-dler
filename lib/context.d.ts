import { IContext } from 'me-actions';
export interface IThread {
    start: number;
    end: number;
    position: number;
}
export interface IDLContext extends IContext {
    url: string;
    file: string;
    mkdir?: boolean;
    overwrite?: boolean;
    mtdfile?: string;
    proxy?: string;
    timeout?: number;
    method?: string;
    headers?: {
        [name: string]: any;
    };
    threads?: number;
    noThreadsSize?: number;
    range?: string;
    metaSize?: number;
    runtime?: {
        fileDescriptor: number;
        fileSize: number;
        acceptRanges: boolean;
        url: string;
        threads: IThread[];
    };
}
