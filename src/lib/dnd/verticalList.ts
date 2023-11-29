import Muuri from 'muuri';

export function initializeDnd(listContainer: HTMLElement, scrollContainer: HTMLElement) {
	// Initialize drag & drop
	const grid = new Muuri(listContainer, {
		dragEnabled: true,
		dragAxis: 'y',
		itemDraggingClass: 'drag-item',
		dragContainer: scrollContainer,
		dragStartPredicate: (item, e) => {
			const htmlEl = item.getElement();

			if (e.isFinal) {
				Muuri.ItemDrag.defaultStartPredicate(item, e);
				return;
			}

			// Disable dnd for decks in editMode
			if (htmlEl && htmlEl.dataset.editMode === 'true') {
				return false;
			} else if (e.distance > 2) {
				return true;
			}
		},
		dragSortHeuristics: {
			sortInterval: 0,
			minDragDistance: 0
		},
		dragSortPredicate: {
			threshold: 30
		},
		dragRelease: {
			// duration: 200,
			// easing: 'ease-out',
			useDragContainer: false
		},
		dragAutoScroll: {
			targets: [
				{ element: document.body, priority: 0 },
				{ element: scrollContainer as HTMLElement, priority: 1 }
			],
			handle: null,
			threshold: 40,
			safeZone: 0.1,
			speed: Muuri.AutoScroller.smoothSpeed(2000, 2700, 3200),
			sortDuringScroll: true,
			smoothStop: true
		}
	});
	// Clear grid if not empty
	grid.remove(grid.getItems());

	return grid;
}

export function syncDnd(
	listContainer: HTMLElement,
	dndList: Muuri,
	dndItems: (Element | null)[],
	dndInitialListFill: boolean
) {
	let updatedDndItems = [...dndItems];
	let initialListFill = dndInitialListFill;

	// Add item to muuri if missing
	for (let i = 0; i < listContainer.children.length; i++) {
		const el = listContainer.children.item(i);
		if (!updatedDndItems.includes(el) && el !== null) {
			const htmlEl = el as HTMLElement;
			// Add items as hidden during initial fill (bulk adding doesn't look good)
			if (initialListFill) {
				dndList.add(htmlEl, { active: false });
			} else {
				dndList.add(htmlEl);
			}
			updatedDndItems.push(el);
		}
	}
	// Show list after initial fill
	if (initialListFill) {
		dndList.show(dndList.getItems());
		initialListFill = false;
	}

	// Remove muuri item if not in listContainer HTMLcollection
	for (let i = 0; i < updatedDndItems.length; i++) {
		const dndItem = updatedDndItems[i];
		let found = false;

		for (let j = 0; j < listContainer.children.length; j++) {
			if (listContainer.children.item(j) === dndItem) {
				found = true;
			}
		}
		if (!found) {
			dndList.remove(dndList.getItems(dndItem as HTMLElement));
			updatedDndItems = updatedDndItems.filter((item) => item !== dndItem);
		}
	}

	return {
		updatedDndItems,
		initialListFill
	};
}

export function sortListDnd(dndList: Muuri, sortMethod: string, sortData: SortDndData[]) {
	dndList.sort((itemA, itemB) => {
		const elA = itemA.getElement();
		const elB = itemB.getElement();
		let dataA: string | number = '';
		let dataB: string | number = '';

		for (let i = 0; i < sortData.length; i++) {
			if (elA?.id === sortData[i].id) {
				dataA = sortData[i].data;
			} else if (elB?.id === sortData[i].id) {
				dataB = sortData[i].data;
			}
		}

		if (sortMethod === 'Custom') {
			if (typeof dataA === 'number' && typeof dataB === 'number') {
				return dataA - dataB;
			}
		} else if (sortMethod === 'Name') {
			if (typeof dataA === 'string' && typeof dataB === 'string') {
				return dataA.localeCompare(dataB);
			}
		}
		return 0;
	});
}
