import http from 'node:http';
import https from 'node:https';

import axios, { type AxiosResponse } from 'axios';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

import { e } from './errs';

http.globalAgent.maxSockets = https.globalAgent.maxSockets = 200;

export function getProxyAgent(proxy: string) {
	if (!proxy) {
		return { httpsAgent: new https.Agent({ rejectUnauthorized: false }) };
	}
	//
	//let options = { ...url.parse(proxy), agentOptions: { keepAlive: true, rejectUnauthorized: false } };
	let options = { keepAlive: true, rejectUnauthorized: false };
	if (proxy.startsWith('socks')) {
		return { httpAgent: new SocksProxyAgent(proxy, options), httpsAgent: new SocksProxyAgent(proxy, options) };
	}
	return { httpAgent: new HttpProxyAgent(proxy, options), httpsAgent: new HttpsProxyAgent(proxy, options) };
	// return {
	// 	httpAgent: new http.Agent({ keepAlive: false }),
	// 	httpsAgent: new https.Agent({ keepAlive: false, rejectUnauthorized: false }),
	// };
}

export async function request(options: {
	method?: string;
	url: string;
	headers?: any;
	timeout?: number;
	proxy?: string;
	[key: string]: any;
}) {
	if (!options.method) options.method = 'GET';
	if (!options.timeout) options.timeout = 10000;
	//
	let canceler = new AbortController();
	let timeout = setTimeout(() => canceler.abort('timeout'), options.timeout);
	let response: AxiosResponse;
	try {
		response = await axios.request({
			...(options as any),
			signal: canceler.signal,
			...getProxyAgent(options.proxy),
		});
		clearTimeout(timeout);
	} catch (err) {
		clearTimeout(timeout);
		if (err === 'timeout') {
			throw e('req_time_out', timeout);
		}
		throw err;
	}
	//
	return response;
}
