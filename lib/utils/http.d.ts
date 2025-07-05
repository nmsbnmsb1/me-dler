import https from 'node:https';
import { type AxiosResponse } from 'axios';
import { DLContext } from '../context';
export declare function getProxyAgent(proxy: string): {
    httpsAgent: https.Agent;
};
export declare function request(context: DLContext, options: {
    method?: string;
    url: string;
    headers?: any;
    timeout?: number;
    proxy?: string;
    [key: string]: any;
}): Promise<AxiosResponse<any, any>>;
