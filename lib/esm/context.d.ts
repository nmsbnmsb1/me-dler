import { IContext } from 'me-actions';
export interface IThread {
    start: number;
    end: number;
    position: number;
}
export interface IDLContext extends IContext {
    dl: {
        url: string;
        file: string;
        mtdfile?: string;
        overwrite?: boolean;
        mkdir?: boolean;
        proxy?: string;
        timeout?: number;
        method?: string;
        headers?: {
            [name: string]: any;
        };
        threads?: number;
        oneThreadSize?: number;
        range?: string;
        metaSize?: number;
        results?: {
            fd: number;
            fileSize: number;
            acceptRanges: boolean;
            url: string;
            threads: IThread[];
        };
    };
}
