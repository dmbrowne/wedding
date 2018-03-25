const host = 'http://localhost:4000';

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
	const { route, resourceType = 'GET', body } = opts;
	const options: RequestInit = {
		...defaultOptions,
		method: resourceType,
		headers: { ...defaultHeaders },
	};

	if (body) {
		options.body = body;
	}

	return fetch(
		`${host}/${route}`,
		options,
	)
	.then(errorHandler);
}