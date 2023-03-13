export function isDeleteKey(k: KeyboardEvent): boolean {
  return ['Backspace', 'Clear', 'Delete', 'Del'].includes(k.key);
}
