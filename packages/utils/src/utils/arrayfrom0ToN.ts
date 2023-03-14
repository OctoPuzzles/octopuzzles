/** Creates an array of numbers from 0 to n - 1 */
export const arrayfrom0ToN = (n: number): number[] => {
  return [...Array(n).keys()];
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('creates a correct array', () => {
    expect(arrayfrom0ToN(6)).toStrictEqual([0, 1, 2, 3, 4, 5]);
  });
}
