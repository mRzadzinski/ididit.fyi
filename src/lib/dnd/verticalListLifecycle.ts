import {
	initializeDndVerticalList,
	sortDndVerticalList,
	syncDndVerticalList
} from '$lib/dnd/verticalList';
import { settings } from '$lib/stores/dbStores';
import {
	dndDisabled,
	dndList,
	dndListContainer,
	dndReorderDbData,
	whereDndIsActive
} from '$lib/stores/dndStores';
import type Muuri from 'muuri';
import { get } from 'svelte/store';

export interface DndReorderData {
	id: string;
	order: number;
}

let listContainer: HTMLElement;
let list: Muuri;

const scrollContainer = document.getElementById('dnd-scroll-container');
let dndInitialListFill = true;
let dndItems: (Element | null)[] = [];
let initialPosition: number;
let droppedPosition: number;
let reorderData: DndReorderData[] = [];
let reorderDataInDB: (reorderData: DndReorderData[]) => void;
let syncTimeoutId: NodeJS.Timeout;
let dragInProgress = false;
let sortData: SortDndData[];
let sortMethod: string;

dndList.subscribe((lst) => (list = lst));
dndListContainer.subscribe((container) => (listContainer = container));
dndReorderDbData.subscribe((fn) => (reorderDataInDB = fn));

export function dndListOnMount() {
	// Initialize drag & drop
	if (scrollContainer) {
		dndList.set(initializeDndVerticalList(listContainer, scrollContainer));
	}

	// Grid events
	list.on('dragInit', function (item) {
		const itemEl = item.getElement();

		// Save index for reorder
		if (itemEl) {
			initialPosition = list.getItems().indexOf(item);
		}
	});
	list.on('dragStart', () => {
		dragInProgress = true;
	});
	list.on('dragEnd', function (item) {
		droppedPosition = list.getItems().indexOf(item);
	});
	list.on('dragReleaseEnd', () => {
		if (initialPosition !== droppedPosition) {
			refreshReorderData();
			reorderDataInDB(reorderData);
		}
		fallbackSyncDnd();
		dragInProgress = false;
	});
	list.on('showEnd', () => {
		keepScrollContainerWidthInSyncWithDndItem();
	});
}

export function dndListAfterUpdate() {
	syncAndSortDnd();
	// Synchronize to handle stacking order of absolutely positioned item menus
	list.synchronize();
	// Refresh dnd items dimensions after resizing
	list.refreshItems();
	list.layout();
}

export function dndListOnDestroy() {
	list.remove(list.getItems());
	list.destroy();
}

function refreshReorderData() {
	// Save dndList items' positions in pair with their IDs
	const items = list.getItems();
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

function refreshSortMethod() {
	const currSettings = get(settings);
	const path = `${get(whereDndIsActive)}OrderBy`;

	if (path === 'decksOrderBy' || path === 'seedsOrderBy') {
		sortMethod = currSettings[path];
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

function updateSortDndData() {
	const dataSort: SortDndData[] = [];
	const items = list.getItems();

	if (sortMethod === 'custom') {
		dndDisabled.set(false);
	} else {
		dndDisabled.set(true);
	}

	for (let i = 0; i < items.length; i++) {
		if (sortMethod === 'custom') {
			const id = items[i].getElement()?.id;
			const data = items[i].getElement()?.getAttribute('data-order');
			if (id && data) {
				dataSort.push({ id, data: parseInt(data) });
			}
		} else if (sortMethod === 'a-z') {
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
	const dndSyncInfo = syncDndVerticalList(listContainer, list, dndItems, dndInitialListFill);
	dndItems = dndSyncInfo.updatedDndItems;
	dndInitialListFill = dndSyncInfo.initialListFill;

	refreshSortMethod();
	updateSortDndData();
	sortDndVerticalList(list, sortMethod, sortData);
}

export function keepScrollContainerWidthInSyncWithDndItem() {
	if (scrollContainer && list) {
		const dndItemWidth = list.getItem(0)?.getElement()?.children[0].clientWidth;
		scrollContainer.style.width = `${dndItemWidth}px`;
	}
}
