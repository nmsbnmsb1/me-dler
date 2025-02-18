"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxyAgent = getProxyAgent;
exports.request = request;
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
const axios_1 = __importDefault(require("axios"));
const http_proxy_agent_1 = require("http-proxy-agent");
const https_proxy_agent_1 = require("https-proxy-agent");
const socks_proxy_agent_1 = require("socks-proxy-agent");
const errs_1 = require("./errs");
node_http_1.default.globalAgent.maxSockets = node_https_1.default.globalAgent.maxSockets = 200;
function getProxyAgent(proxy) {
    if (!proxy) {
        return { httpsAgent: new node_https_1.default.Agent({ rejectUnauthorized: false }) };
    }
    let options = { keepAlive: true, rejectUnauthorized: false };
    if (proxy.startsWith('socks')) {
        return { httpAgent: new socks_proxy_agent_1.SocksProxyAgent(proxy, options), httpsAgent: new socks_proxy_agent_1.SocksProxyAgent(proxy, options) };
    }
    return { httpAgent: new http_proxy_agent_1.HttpProxyAgent(proxy, options), httpsAgent: new https_proxy_agent_1.HttpsProxyAgent(proxy, options) };
}
async function request(context, options) {
    if (!options.method)
        options.method = 'GET';
    if (!options.timeout)
        options.timeout = 10000;
    let canceler = new AbortController();
    let timeout = setTimeout(() => canceler.abort('timeout'), options.timeout);
    let response;
    try {
        response = await axios_1.default.request({
            ...options,
            signal: canceler.signal,
            ...getProxyAgent(options.proxy),
        });
        clearTimeout(timeout);
    }
    catch (err) {
        clearTimeout(timeout);
        if (err === 'timeout') {
            throw (0, errs_1.e)(context, 'req_time_out', timeout);
        }
        throw err;
    }
    return response;
}
//# sourceMappingURL=http.js.map