import { vi } from 'vitest';
import { writable } from 'svelte/store';

const mockLoginErrorStore = writable<string>('');
export const mockLoginError = {
	subscribe: mockLoginErrorStore.subscribe,
	set: vi.fn(),
	setValue: (string: string): void => mockLoginErrorStore.set(string)
};

const mockRegisterErrorStore = writable<string>('');
export const mockRegisterError = {
	subscribe: mockRegisterErrorStore.subscribe,
	set: vi.fn(),
	setValue: (string: string): void => mockRegisterErrorStore.set(string)
};

const mockEmailLinkLoginStore = writable<boolean>(false);
export const mockEmailLinkLogin = {
	subscribe: mockEmailLinkLoginStore.subscribe,
	set: vi.fn(),
	setValue: (boolean: boolean): void => mockEmailLinkLoginStore.set(boolean)
};