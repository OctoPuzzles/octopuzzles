import type { User } from '@octopuzzles/models';
import { writable } from 'svelte/store';

export const me = writable<Pick<User, 'id' | 'email' | 'role' | 'username'> | null>(null);
