import Muuri from 'muuri';

export function initializeDnd(listContainer: HTMLElement) {
	// Initialize drag & drop
	const grid = new Muuri(listContainer, {
		dragEnabled: true,
		dragAxis: 'y',
		dragStartPredicate: { distance: 1 },
		dragSortHeuristics: {
			sortInterval: 0,
			minDragDistance: 0
		},
		dragSortPredicate: {
			threshold: 30
		},
		itemDraggingClass: 'drag-item'
	});
	// Clear grid if not empty
	grid.remove(grid.getItems());

	return grid;
}

export function syncDnd(
	listContainer: HTMLElement,
	dndGrid: Muuri,
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
				dndGrid.add(htmlEl, { active: false });
			} else {
				dndGrid.add(htmlEl);
			}
			updatedDndItems.push(el);
		}
	}
	// Show list after initial fill
	if (initialListFill) {
		dndGrid.show(dndGrid.getItems());
		initialListFill = false;
	}

	// Remove muuri item if not in listContainer HTMLcollection
	updatedDndItems.forEach((muuriItem) => {
		let found = false;
		for (let i = 0; i < listContainer.children.length; i++) {
			if (listContainer.children.item(i) === muuriItem) {
				found = true;
			}
		}
		if (!found) {
			dndGrid.remove(dndGrid.getItems(muuriItem as HTMLElement));
			updatedDndItems = updatedDndItems.filter((item) => item !== muuriItem);
		}
	});

	return {
		updatedDndItems,
		initialListFill
	};
}

export function sortListDnd(dndGrid: Muuri) {
	// Sort dnd list by item order
	dndGrid.sort(function (itemA, itemB) {
		const elA = itemA.getElement();
		const elB = itemB.getElement();
		const orderAttrA = elA ? elA.getAttribute('data-order') : null;
		const orderAttrB = elB ? elB.getAttribute('data-order') : null;

		if (orderAttrA && orderAttrB) {
			return parseInt(orderAttrA) - parseInt(orderAttrB);
		} else {
			return 0;
		}
	});
}
