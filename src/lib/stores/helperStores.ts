import { writable } from 'svelte/store';

export const addNewItem = writable<() => void>();
export const newItemBtnName = writable('');
export const disableNewItemBtn = writable(false);
export const handleDeleteItem = writable<
	((itemId: string, dndItem: HTMLElement) => void) | ((itemId: string) => void) | (() => void)
>();
