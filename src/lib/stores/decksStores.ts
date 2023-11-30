import type Muuri from 'muuri';
import { writable } from 'svelte/store';

export const decksDndList = writable<Muuri>();
export const decksListContainer = writable<HTMLElement>();
export const decksScrollContainer = writable<HTMLElement>();