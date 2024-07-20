import https from 'https';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { AxiosResponse } from 'axios';
export declare function getProxyAgent(proxy: string): {
    httpsAgent: https.Agent;
    httpAgent?: undefined;
} | {
    httpAgent: SocksProxyAgent;
    httpsAgent: SocksProxyAgent;
} | {
    httpAgent: HttpProxyAgent<string>;
    httpsAgent: HttpsProxyAgent<string>;
};
export declare function request(options: {
    method?: string;
    url: string;
    headers?: any;
    timeout?: number;
    proxy?: string;
    [key: string]: any;
}): Promise<AxiosResponse<any, any>>;
