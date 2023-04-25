import { trpc } from '$lib/trpc/client';
import type { UserSettings } from '@octopuzzles/models';
import { derived, get, writable, type Readable } from 'svelte/store';
import { me } from './meStore';
import { page } from '$app/stores';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createSettingsStore() {
  const settings = writable<Partial<UserSettings>>({});

  function set(newSettings: UserSettings | null = null) {
    settings.set(newSettings ?? {});
  }

  function getGroup<T extends keyof UserSettings>(type: T): Readable<UserSettings[T]> {
    return derived([settings], ([$settings]) => {
      return $settings?.[type] as UserSettings[T];
    });
  }

  async function save(newSettings: Partial<UserSettings>) {
    const oldSettings = get(settings) ?? {};
    settings.set({ ...oldSettings, ...newSettings });

    const userId = get(me)?.id;
    if (userId) {
      await trpc(get(page)).userSettings.save.mutate(newSettings);
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
