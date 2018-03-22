export const getDesiredValuesFromRequestBody = (desiredValues, requestBody) => {
	return desiredValues.reduce((values, keyValue) => {
		const value = requestBody[keyValue];
		return (value ?
			{ ...values, [keyValue]: value } :
			values
		);
	}, {});
};
