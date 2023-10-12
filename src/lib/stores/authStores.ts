import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const user = writable<User | null | undefined>(undefined);
export const firstLogin = writable<boolean | undefined>(undefined);
export const emailLinkLogin = writable<boolean | undefined>(false);
export const loggedIn = writable(false);

export const registerError = writable<string>('');
export const loginError = writable<string>('');
export const logoutError = writable<string>('');
export const updatePasswordError = writable<string>('');