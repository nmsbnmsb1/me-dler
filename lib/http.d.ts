/// <reference types="node" />
import https from 'https';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { AxiosResponse } from 'axios';
export declare function getProxyAgent(proxy: string): {
    httpsAgent: https.Agent;
    httpAgent?: undefined;
} | {
    httpAgent: SocksProxyAgent;
    httpsAgent: SocksProxyAgent;
} | {
    httpAgent: import("http-proxy-agent/dist/agent").default;
    httpsAgent: import("https-proxy-agent/dist/agent").default;
};
export declare function request(options: {
    method?: string;
    url: string;
    headers?: any;
    timeout?: number;
    proxy?: string;
    [key: string]: any;
}): Promise<AxiosResponse<any, any>>;
