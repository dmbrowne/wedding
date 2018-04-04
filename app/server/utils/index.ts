import { Request } from 'express';

export function getDesiredValuesFromRequestBody(
	desiredValues: string[],
	requestBody: Request['body'],
): {[key: string]: any} | null {
	const foundValues = desiredValues.reduce((values, keyValue: string) => {
		const value = requestBody[keyValue];
		return (value ?
			{ ...values, [keyValue]: value } :
			values
		);
	}, {});

	return Object.keys(foundValues).length ? foundValues : null;
}

export function asyncAwaitTryCatch(promise) {
	return promise.then(data => {
		return [null, data];
	})
	.catch(err => [err]);
}
