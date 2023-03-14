/** capitalizes the first letter of each word in a string, and makes all other letters small */
export const capitalize = (s: string): string => {
  return s
    .toLowerCase()
    .replace('_', ' ')
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('capitalizes correctly', () => {
    expect(capitalize('hello there_man')).toEqual('Hello There Man');
  });
}
