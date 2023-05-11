import { trpc } from '$lib/trpc/client';
import type { UserSettings } from '@octopuzzles/models';
import { get, writable } from 'svelte/store';
import { me } from './meStore';
import { page } from '$app/stores';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createSettingsStore() {
  const settings = writable<Partial<UserSettings>>({});

  function set(newSettings: UserSettings | null = null): void {
    settings.set(newSettings ?? {});
  }

  async function save(newSettings: Partial<UserSettings>): Promise<void> {
    const oldSettings = get(settings) ?? {};
    settings.set({ ...oldSettings, ...newSettings });

    const userId = get(me)?.id;
    if (userId != null) {
      await trpc(get(page)).userSettings.save.mutate(newSettings);
    }
  }

  return {
    subscribe: settings.subscribe,
    set,
    save
  };
}

export const settings = createSettingsStore();
