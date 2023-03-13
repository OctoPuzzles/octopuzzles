export function isCommandKey(k: KeyboardEvent | MouseEvent): boolean {
  // eslint-disable-next-line no-restricted-syntax
  return k.metaKey || k.ctrlKey;
}
