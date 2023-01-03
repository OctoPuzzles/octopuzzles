import trpc from '$lib/client/trpc';
import type { UserSettings } from '$models/UserSettings';
import { derived, get, writable, type Readable } from 'svelte/store';
import { me } from './meStore';
import { scanner } from './sudokuStore/scanner';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createSettingsStore() {
  const settings = writable<Partial<UserSettings>>({});

  function set(newSettings: UserSettings | null = null) {
    settings.set(newSettings ?? {});

    scanner.configure(newSettings?.scanner);
  }

  function getGroup<T extends keyof UserSettings>(type: T): Readable<UserSettings[T]> {
    return derived([settings], ([$settings]) => {
      return $settings?.[type] as UserSettings[T];
    });
  }

  async function save(newSettings: Partial<UserSettings>) {
    const oldSettings = get(settings) ?? {};
    settings.set({ ...oldSettings, ...newSettings });

    scanner.configure(newSettings?.scanner);

    const userId = get(me)?.id;
    if (userId) {
      await trpc().mutation('userSettings:save', newSettings);
    }
  }

  return {
    subscribe: settings.subscribe,
    set,
    getGroup,
    save
  };
}

export const settings = createSettingsStore();
