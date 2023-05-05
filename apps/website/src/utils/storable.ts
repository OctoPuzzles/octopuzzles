import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export function storable<T>(key: string, data: T): Writable<T> {
  const store = writable<T>(data);
  const { subscribe, set, update } = store;

  const storedItem = browser ? localStorage.getItem(key) : null;
  if (storedItem != null) {
    set(JSON.parse(storedItem));
  }

  return {
    subscribe,
    set: (newValue: T) => {
      if (browser) {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
      set(newValue);
    },
    update: (cb: (value: T) => T) => {
      update((v) => {
        const updatedStore = cb(v);
        if (browser) {
          localStorage.setItem(key, JSON.stringify(updatedStore));
        }
        return updatedStore;
      });
    }
  };
}
