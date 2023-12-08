import { writable } from 'svelte/store';

export const addNewItem = writable<(() => void) | ((show: boolean) => void)>();
export const newItemBtnName = writable('');
export const disableNewItemBtn = writable(false);
