import trpc from '$lib/client/trpc';
import type { User, UserSettings } from '@octopuzzles/models';
import { get, writable } from 'svelte/store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createMeStore() {
  const user = writable<Pick<User, 'id' | 'email' | 'role' | 'username'> | null>(null);
  const settings = writable<Partial<UserSettings>>({});

  function set(
    newUser: Pick<User, 'id' | 'email' | 'role' | 'username'> | null,
    newSettings: UserSettings | null = null
  ) {
    user.set(newUser);
    settings.set(newSettings ?? {});
  }

  function getSettings(): Partial<UserSettings> {
    return get(settings);
  }

  async function saveSettings(newSettings: Partial<UserSettings>) {
    const oldSettings = get(settings) ?? {};
    settings.set({ ...oldSettings, ...newSettings });

    const userData = get(user);
    if (userData?.id) {
      await trpc().mutation('users:saveSettings', newSettings);
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
