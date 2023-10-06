import { writable } from 'svelte/store';

export const signUpError = writable<string>('');
export const signInError = writable<string>('');
export const signOutError = writable<string>('');
export const updatePasswordError = writable<string>('');