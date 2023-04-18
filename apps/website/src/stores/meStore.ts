import { trpc } from '$lib/trpc/client';
import type { User, UserSettings } from '@octopuzzles/models';
import { get, writable } from 'svelte/store';
import { page } from '$app/stores';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createMeStore() {
  const user = writable<Pick<User, 'id' | 'email' | 'role' | 'username'> | null>(null);
  const settings = writable<Partial<UserSettings>>({});

  function set(
    newUser: Pick<User, 'id' | 'email' | 'role' | 'username'> | null,
    newSettings: UserSettings | null = null
  ): void {
    user.set(newUser);
    settings.set(newSettings ?? {});
  }

  function getSettings(): Partial<UserSettings> {
    return get(settings);
  }

  async function saveSettings(newSettings: Partial<UserSettings>): Promise<void> {
    const oldSettings = get(settings) ?? {};
    settings.set({ ...oldSettings, ...newSettings });

    const userData = get(user);
    if (userData?.id != null) {
      await trpc(get(page)).users.saveSettings.mutate(newSettings);
    }
  }

  return {
    subscribe: user.subscribe,
    set,
    settings,
    getSettings,
    saveSettings
  };
}

export const me = createMeStore();
