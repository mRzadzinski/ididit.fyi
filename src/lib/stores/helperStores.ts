import { writable } from 'svelte/store';

export const addNewItem = writable<(show?: boolean) => void>();
export const newItemBtnName = writable('');
export const disableNewItemBtn = writable(false);

export const searchPhrase = writable('');
