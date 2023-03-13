import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type AuthMode = 'login' | 'signup';

type RetType = {
  subscribe: Writable<AuthMode | undefined>['subscribe'];
  setAuthMode: (newAuthMode?: AuthMode | undefined) => void;
};

function createAuthMode(): RetType {
  const { subscribe, update } = writable<AuthMode | undefined>();

  /**
   * Set the authMode.
   * This makes the authDrawer show.
   * to hide the authDrawer, call it with no parameters
   */
  function setAuthMode(newAuthMode?: AuthMode): void {
    update((authMode) => {
      if (newAuthMode) {
        if (newAuthMode === authMode) {
          return undefined;
        } else {
          return newAuthMode;
        }
      } else {
        return undefined;
      }
    });
  }

  return {
    subscribe,
    setAuthMode
  };
}

export const authMode = createAuthMode();
