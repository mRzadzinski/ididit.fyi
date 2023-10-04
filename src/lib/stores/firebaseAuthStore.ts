import { writable } from 'svelte/store';

interface AuthUser {
	uid: string;
	email: string;
}

export const authUser = writable<AuthUser | null>(null);
export const signUpError = writable<string>('')
export const loginError = writable<string>('')
export const logoutError = writable<string>('')