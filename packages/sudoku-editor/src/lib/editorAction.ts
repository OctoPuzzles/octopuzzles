import { hasOpenModals } from '@octopuzzles/ui';
import { arrowKeyDirection, type ArrowDirection } from '@octopuzzles/utils';

let editorInFocus = false;
const listenForEvents = (): boolean => !hasOpenModals() && editorInFocus;

export function handleWindowClick(e: MouseEvent): void {
  let isInFocus = false;
  if (e.target instanceof Element) {
    let target: Element | null = e.target;
    while (target != null && target.id !== 'sudoku-editor' && target.nodeName !== 'body') {
      target = target.parentElement;
    }

    if (target?.id === 'sudoku-editor') {
      isInFocus = true;
    }
  }
  editorInFocus = isInFocus;
}

type EditorActionParams = {
  onKeyDown?: (k: KeyboardEvent) => void;
  onArrowKeyDown?: (direction: ArrowDirection, k: KeyboardEvent) => void;
};

/**
 * Handle an event when the editor is in focus.
 *
 * ## Example
 * ```svelte
 * <svelte:window use:editorAction={{
 *  onKeyDown: (k) => console.log(k)
 * }} />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function editorAction(node: HTMLElement, { onKeyDown, onArrowKeyDown }: EditorActionParams) {
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

  if (onKeyDown != null) {
    node.addEventListener('keydown', handleKeyDown);
  }

  if (onArrowKeyDown != null) {
    node.addEventListener('keydown', handleArrowKeyDown);
  }

  return {
    destroy() {
      if (onKeyDown != null) {
        node.removeEventListener('keydown', handleKeyDown);
      }

      if (onArrowKeyDown != null) {
        node.removeEventListener('keydown', handleArrowKeyDown);
      }
    }
  };
}
