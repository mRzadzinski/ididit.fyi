import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const user = writable<User | null | undefined>(undefined);
export const firstSignIn = writable<boolean | undefined>();
