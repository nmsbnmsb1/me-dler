import http from 'http';
import https from 'https';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import axios from 'axios';
import { e } from './errs';
http.globalAgent.maxSockets = https.globalAgent.maxSockets = 200;
export function getProxyAgent(proxy) {
    if (!proxy) {
        return { httpsAgent: new https.Agent({ rejectUnauthorized: false }) };
    }
    let options = { keepAlive: true, rejectUnauthorized: false };
    if (proxy.startsWith('socks')) {
        return { httpAgent: new SocksProxyAgent(proxy, options), httpsAgent: new SocksProxyAgent(proxy, options) };
    }
    return { httpAgent: new HttpProxyAgent(proxy, options), httpsAgent: new HttpsProxyAgent(proxy, options) };
}
export async function request(options) {
    if (!options.method)
        options.method = 'GET';
    if (!options.timeout)
        options.timeout = 10000;
    let canceler = new AbortController();
    let timeout = setTimeout(() => canceler.abort('timeout'), options.timeout);
    let response;
    try {
        response = await axios.request({
            ...options,
            signal: canceler.signal,
            ...getProxyAgent(options.proxy),
        });
        clearTimeout(timeout);
    }
    catch (err) {
        clearTimeout(timeout);
        if (err === 'timeout') {
            throw e(1000, timeout);
        }
        else {
            throw err;
        }
    }
    return response;
}
//# sourceMappingURL=http.js.map