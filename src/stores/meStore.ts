import type { User } from '$models/User';
import { writable } from 'svelte/store';

export const me = writable<Pick<User, 'id' | 'email' | 'role' | 'username'> | null>(null);
