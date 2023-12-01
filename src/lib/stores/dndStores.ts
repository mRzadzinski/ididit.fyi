import type { DndReorderData } from '$lib/dnd/verticalListLifecycle';
import type Muuri from 'muuri';
import { writable } from 'svelte/store';

export const whereDndIsActive = writable<string>('decks');
export const dndList = writable<Muuri>();
export const dndListContainer = writable<HTMLElement>();
export const dndReorderDbData = writable<(reorderData: DndReorderData[]) => void>();
export const dndDisabled = writable<boolean>()
