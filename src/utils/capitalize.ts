/** capitalizes the first letter of each word in a string, and makes all other letters small */
const capitalize = (s: string): string => {
	return s
		.toLowerCase()
		.replace('_', ' ')
		.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
};

export default capitalize;
