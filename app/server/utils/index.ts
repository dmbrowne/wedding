import { Request } from 'express';

export const getDesiredValuesFromRequestBody = (
	desiredValues: string[],
	requestBody: Request['body'],
): {[key: string]: any} | null => {
	const foundValues = desiredValues.reduce((values, keyValue: string) => {
		const value = requestBody[keyValue];
		return (value ?
			{ ...values, [keyValue]: value } :
			values
		);
	}, {});

	return Object.keys(foundValues).length ? foundValues : null;
};
