import * as es6Promise from 'es6-promise';
es6Promise.polyfill();
import 'isomorphic-fetch';

const defaultHeaders = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	"X-Requested-With": 'XMLHttpRequest',
};

const defaultOptions = {
	credentials: 'include' as RequestCredentials,
	headers: defaultHeaders,
};

const errorHandler = (res: Response) => {
	if (res.status >= 300) {
		throw res;
	}
	return res.json();
};

export const restfulRequest = (opts) => {
	const { route, method = 'GET', body } = opts;
	const options: RequestInit = {
		...defaultOptions,
		method,
		headers: { ...defaultHeaders },
	};

	if (body) {
		options.body = body;
	}

	return fetch(`/${route}`, options)
		.then(errorHandler)
		.catch(err => {
			console.error(err);
			throw err;
		});
};

export const multipartFormRequest = (opts) => {
	interface RequestOptions {
		method: Request['method'];
		body?: any;
		credentials: RequestCredentials;
	}

	const { route, method = 'POST', body } = opts;
	const options: RequestOptions = {
		method,
		credentials: 'include' as RequestCredentials,
	};

	if (body) {
		options.body = body;
	}

	return fetch(`/${route}`, {
		method,
		body,
		credentials: 'include' as RequestCredentials,
	})
	.then(errorHandler)
	.catch(err => {
		console.error(err);
		throw err;
	});
};
