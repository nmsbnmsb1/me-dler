import { IContext } from 'me-actions';
export interface IThread {
    start: number;
    end: number;
    position: number;
    done: boolean;
}
export interface IMetaData {
    dlFile: string;
    dlDescriptor: number;
    errFile: string;
    status: string;
    ddxc: boolean;
    url: string;
    acceptRanges: boolean;
    fileSize: number;
    threads: IThread[];
    err?: Error;
}
export interface IDLContext extends IContext {
    url: string;
    file: string;
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
    metaData?: IMetaData;
}
