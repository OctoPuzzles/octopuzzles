import { hasOpenModals } from '@octopuzzles/ui';

let editorInFocus = false;
const listenForEvents = () => !hasOpenModals() && editorInFocus;

export function handleWindowClick(e: MouseEvent) {
  let isInFocus = false;
  if (e.target instanceof Element) {
    let target: Element | null = e.target;
    while (target !== null && target.id !== 'sudoku-editor' && target.nodeName !== 'body') {
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
export function editorAction(node: HTMLElement, { onKeyDown }: EditorActionParams) {
  if (onKeyDown != null) {
    node.addEventListener('keydown', (k) => {
      if (listenForEvents()) {
        onKeyDown(k);
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
    }
  };
}
