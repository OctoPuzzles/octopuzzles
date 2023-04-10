export function isArrowKey(k: KeyboardEvent): boolean {
  return k.key.startsWith('Arrow');
}

export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Returns the direction of the arrow key, if k is an arrow key, otherwise undefined
 */
export function arrowKeyDirection(k: KeyboardEvent): ArrowDirection | undefined {
  if (isArrowKey(k)) {
    return k.key.slice(5).toLowerCase() as ArrowDirection;
  }

  return undefined;
}
