import { hasOpenModals } from '@octopuzzles/ui';

let gameInFocus = false;
const listenForEvents = () => !hasOpenModals() && gameInFocus;

export function handleWindowClick(e: MouseEvent) {
  let isInFocus = false;
  if (e.target instanceof Element) {
    let target: Element | null = e.target;
    while (target !== null && target.id !== 'sudoku-game' && target.nodeName !== 'body') {
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
export function gameAction(node: HTMLElement, { onKeyDown, onKeyUp }: GameActionParams) {
  if (onKeyDown != null) {
    node.addEventListener('keydown', (k) => {
      if (listenForEvents()) {
        onKeyDown(k);
      }
    });
  }
  if (onKeyUp != null) {
    node.addEventListener('keyup', (k) => {
      if (listenForEvents()) {
        onKeyUp(k);
      }
    });
  }

  return {
    destroy() {
      if (onKeyDown != null) {
        node.removeEventListener('keydown', (k) => {
          if (listenForEvents()) {
            onKeyDown(k);
          }
        });
      }
      if (onKeyUp != null) {
        node.removeEventListener('keyup', (k) => {
          if (listenForEvents()) {
            onKeyUp(k);
          }
        });
      }
    }
  };
}
