import { IContext } from 'me-actions';
export interface IThread {
    start: number;
    end: number;
    position: number;
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
}
export interface IDLContext extends IContext {
    url: string;
    file: string;
    mkdir?: boolean;
    overwrite?: boolean;
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
