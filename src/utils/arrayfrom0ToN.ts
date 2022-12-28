/** Creates an array of numbers from 0 to n - 1 */
const arrayfrom0ToN = (n: number): number[] => {
	return [...Array(n).keys()];
};

export default arrayfrom0ToN;
