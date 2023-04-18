import { hasOpenModals } from '@octopuzzles/ui';
import { arrowKeyDirection, type ArrowDirection } from '@octopuzzles/utils';

let gameInFocus = false;
const listenForEvents = (): boolean => !hasOpenModals() && gameInFocus;

export function handleWindowClick(e: MouseEvent): void {
  let isInFocus = false;
  if (e.target instanceof Element) {
    let target: Element | null = e.target;
    while (target != null && target.id !== 'sudoku-game' && target.nodeName !== 'body') {
      target = target.parentElement;
    }

    if (target?.id === 'sudoku-game') {
      isInFocus = true;
    }
  }
  gameInFocus = isInFocus;
}

type GameActionParams = {
  onKeyDown?: (k: KeyboardEvent) => void;
  onKeyUp?: (k: KeyboardEvent) => void;
  onArrowKeyDown?: (direction: ArrowDirection, k: KeyboardEvent) => void;
};

/**
 * Handle an event when the game is in focus.
 *
 * ## Example
 * ```svelte
 * <svelte:window use:gameAction={{
 *  onKeyDown: (k) => console.log(k)
 * }} />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function gameAction(
  node: HTMLElement,
  { onKeyDown, onKeyUp, onArrowKeyDown }: GameActionParams
) {
  const handleKeyDown = (k: KeyboardEvent): void => {
    if (listenForEvents()) {
      onKeyDown?.(k);
    }
  };
  const handleArrowKeyDown = (k: KeyboardEvent): void => {
    const direction = arrowKeyDirection(k);
    if (listenForEvents() && direction != null) {
      onArrowKeyDown?.(direction, k);
    }
  };
  const handleKeyUp = (k: KeyboardEvent): void => {
    if (listenForEvents()) {
      onKeyUp?.(k);
    }
  };
  if (onKeyDown != null) {
    node.addEventListener('keydown', handleKeyDown);
  }

  if (onArrowKeyDown != null) {
    node.addEventListener('keydown', handleArrowKeyDown);
  }

  if (onKeyUp != null) {
    node.addEventListener('keyup', handleKeyUp);
  }

  return {
    destroy() {
      if (onKeyDown != null) {
        node.removeEventListener('keydown', handleKeyDown);
      }
      if (onArrowKeyDown != null) {
        node.removeEventListener('keydown', handleArrowKeyDown);
      }
      if (onKeyUp != null) {
        node.removeEventListener('keyup', handleKeyUp);
      }
    }
  };
}
