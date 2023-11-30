import { initializeDndVerticalList, sortListDnd, syncDnd } from '$lib/dnd/verticalList';
import { settings } from '$lib/stores/dbStores';
import { decksDndList, decksListContainer, decksScrollContainer } from '$lib/stores/decksStores';
import type Muuri from 'muuri';
import { get } from 'svelte/store';
import { reorderSeeds } from './decksLogic';

export interface ReorderDecksData {
	id: string;
	order: number;
}

let listContainer: HTMLElement;
let scrollContainer: HTMLElement | null;
let dndList: Muuri;

let dndInitialListFill = true;
let dndItems: (Element | null)[] = [];
let initialPosition: number;
let droppedPosition: number;
let reorderData: ReorderDecksData[] = [];
let syncTimeoutId: NodeJS.Timeout;
let dragInProgress = false;
let sortData: SortDndData[];

decksDndList.subscribe((list) => (dndList = list));
decksListContainer.subscribe((container) => (listContainer = container));
decksScrollContainer.subscribe((container) => (scrollContainer = container));

export function keepScrollContainerWidthInSyncWithDecks() {
	const dndItemWidth = dndList.getItem(0)?.getElement()?.children[0].clientWidth;
	if (scrollContainer) {
		scrollContainer.style.width = `${dndItemWidth}px`;
	}
}

function refreshReorderData() {
	// Save dndList items' positions in pair with their IDs
	const items = dndList.getItems();
	reorderData = [];
	for (let i = 0; i < items.length; i++) {
		const el = items[i].getElement();
		if (el) {
			reorderData.push({
				id: el.id,
				order: i
			});
		}
	}
}

// Sync dnd in case of animation glitch after too fast dnd actions
function fallbackSyncDnd() {
	clearTimeout(syncTimeoutId);

	syncTimeoutId = setTimeout(() => {
		if (!dragInProgress) {
			syncAndSortDnd();
		} else {
			fallbackSyncDnd();
		}
	}, 1500);
}

function updateDecksSortDndData() {
	const dataSort: SortDndData[] = [];
	const items = dndList.getItems();

	for (let i = 0; i < items.length; i++) {
		if (get(settings).decksOrderBy === 'Custom') {
			const id = items[i].getElement()?.id;
			const data = items[i].getElement()?.getAttribute('data-order');
			if (id && data) {
				dataSort.push({ id, data: parseInt(data) });
			}
		} else if (get(settings).decksOrderBy === 'Name') {
			const id = items[i].getElement()?.id;
			const data = items[i].getElement()?.children[0].children[0].textContent;
			if (id && data) {
				dataSort.push({ id, data });
			}
		}
	}
	sortData = dataSort;
}

function syncAndSortDnd() {
	// Keep dnd list in sync with listContainer and update reference array
	const dndSyncInfo = syncDnd(listContainer, dndList, dndItems, dndInitialListFill);
	dndItems = dndSyncInfo.updatedDndItems;
	dndInitialListFill = dndSyncInfo.initialListFill;

	updateDecksSortDndData();
	sortListDnd(dndList, get(settings).decksOrderBy, sortData);
}

export function decksDndOnMount() {
	// Initialize drag & drop
	if (scrollContainer) {
		decksDndList.set(initializeDndVerticalList(listContainer, scrollContainer));
	}

	// Grid events
	dndList.on('dragInit', function (item) {
		const itemEl = item.getElement();

		// Save index for reorder
		if (itemEl) {
			initialPosition = dndList.getItems().indexOf(item);
		}
	});
	dndList.on('dragStart', () => {
		dragInProgress = true;
	});
	dndList.on('dragEnd', function (item) {
		droppedPosition = dndList.getItems().indexOf(item);
	});
	dndList.on('dragReleaseEnd', () => {
		if (initialPosition !== droppedPosition) {
			refreshReorderData();
			reorderSeeds(reorderData);
		}
		fallbackSyncDnd();
		dragInProgress = false;
	});
	dndList.on('showEnd', () => {
		keepScrollContainerWidthInSyncWithDecks();
	});
}

export function decksDndAfterUpdate() {
	syncAndSortDnd();
	// Synchronize to handle stacking order of absolutely positioned deck menus
	dndList.synchronize();
	// Refresh dnd items dimensions after resizing
	dndList.refreshItems();
	dndList.layout();
}

export function decksDndOnDestroy() {
	dndList.remove(dndList.getItems());
	dndList.destroy();
}
