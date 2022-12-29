// Move an element in an array from one index to another index
const moveArrayElement = <T>(arr: (T | undefined)[], old_index: number, new_index: number): T[] => {
	const newArray = arr;
	if (new_index >= newArray.length) {
		let k = new_index - newArray.length + 1;
		while (k--) {
			newArray.push(undefined);
		}
	}
	newArray.splice(new_index, 0, newArray.splice(old_index, 1)[0]);
	return newArray as T[];
};

export default moveArrayElement;

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;
	it('correctly moves elements around', () => {
		const a = [1, 2, 3, 4, 5];
		expect(moveArrayElement(a, 0, 1)).toStrictEqual([2, 1, 3, 4, 5]);
	});
}
