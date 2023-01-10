// Transforms filed errors from graphql to an object of field, message key value pairs
function toErrorMap(
	errors: {
		readonly field: string;
		readonly message: string;
	}[]
): Record<string, string> {
	const errorMap: Record<string, string> = {};
	errors.forEach(({ field, message }) => {
		errorMap[field] = message;
	});

	return errorMap;
}

export default toErrorMap;
