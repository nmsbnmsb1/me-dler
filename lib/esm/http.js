import url from 'url';
import http from 'http';
import https from 'https';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import axios from 'axios';
http.globalAgent.maxSockets = https.globalAgent.maxSockets = 200;
export function getProxyAgent(proxy) {
    if (!proxy) {
        return { httpsAgent: new https.Agent({ rejectUnauthorized: false }) };
    }
    let options = { ...url.parse(proxy), agentOptions: { keepAlive: true, rejectUnauthorized: false } };
    if (proxy.startsWith('socks')) {
        return { httpAgent: new SocksProxyAgent(options), httpsAgent: new SocksProxyAgent(options) };
    }
    return { httpAgent: new HttpProxyAgent(options), httpsAgent: new HttpsProxyAgent(options) };
}
export async function request(options) {
    if (!options.method)
        options.method = 'GET';
    if (!options.timeout)
        options.timeout = 10000;
    let canceler = new AbortController();
    let timeout = setTimeout(() => canceler.abort(), options.timeout);
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
        throw err;
    }
    return response;
}
//# sourceMappingURL=http.js.map