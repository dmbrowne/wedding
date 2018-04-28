import { Request } from 'express';

export function getDesiredValuesFromRequestBody(
	desiredValues: string[],
	requestBody: Request['body'],
): {[key: string]: any} | null {
	const foundValues = desiredValues.reduce((values, keyValue: string) => {
		const exists = keyValue in requestBody;
		return (exists ?
			{ ...values, [keyValue]: requestBody[keyValue] } :
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

export function arrayToObject(arr, keyBy: string) {
	if (!Array.isArray(arr)) {
		throw new Error('arrayToObject() requires an array');
	}
	return arr.reduce((parties, item) => ({
		...parties,
		[item[keyBy]]: item,
	}), {});
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
