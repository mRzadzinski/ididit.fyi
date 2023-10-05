import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const user = writable<User | null>(null);
export const signUpError = writable<string>('')
export const loginError = writable<string>('')
export const logoutError = writable<string>('')