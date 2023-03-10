"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = exports.getProxyAgent = void 0;
const url_1 = __importDefault(require("url"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const http_proxy_agent_1 = require("http-proxy-agent");
const https_proxy_agent_1 = require("https-proxy-agent");
const socks_proxy_agent_1 = require("socks-proxy-agent");
const axios_1 = __importDefault(require("axios"));
http_1.default.globalAgent.maxSockets = https_1.default.globalAgent.maxSockets = 200;
function getProxyAgent(proxy) {
    if (!proxy) {
        return { httpsAgent: new https_1.default.Agent({ rejectUnauthorized: false }) };
    }
    let options = { ...url_1.default.parse(proxy), agentOptions: { keepAlive: true, rejectUnauthorized: false } };
    if (proxy.startsWith('socks')) {
        return { httpAgent: new socks_proxy_agent_1.SocksProxyAgent(options), httpsAgent: new socks_proxy_agent_1.SocksProxyAgent(options) };
    }
    return { httpAgent: new http_proxy_agent_1.HttpProxyAgent(options), httpsAgent: new https_proxy_agent_1.HttpsProxyAgent(options) };
}
exports.getProxyAgent = getProxyAgent;
async function request(options) {
    if (!options.method)
        options.method = 'GET';
    if (!options.timeout)
        options.timeout = 10000;
    let canceler = new AbortController();
    let timeout = setTimeout(() => canceler.abort(), options.timeout);
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
        throw err;
    }
    return response;
}
exports.request = request;
//# sourceMappingURL=http.js.map