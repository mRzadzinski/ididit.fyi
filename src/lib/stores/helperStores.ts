import { writable } from 'svelte/store';

export const addNewItem = writable<() => void>();
export const newItemBtnName = writable('');