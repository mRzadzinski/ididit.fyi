<script lang="ts">
	import SeedsCategory from '$components/seeds/SeedsCategory.svelte';
	import { seedsData, type SeedsDeck } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import Muuri from 'muuri';

	let listContainer: HTMLElement;
	let grid: Muuri;
	let muuriItems: (Element | null)[] = [];
	let seedListVisibilityTimeout: NodeJS.Timeout;
	let initialListFill = true;

	onMount(() => {
		// Initialize drag & drop
		grid = new Muuri(listContainer, {
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

		// Grid events
		grid.on('dragInit', function (item, event) {
			console.log(item.getElement()?.id);
			console.log(grid.getItems().indexOf(item));
		});
		grid.on('dragEnd', function (item, event) {
			console.log(grid.getItems().indexOf(item));
		});
	});

	afterUpdate(async () => {
		// Add item to muuri if missing
		for (let i = 0; i < listContainer.children.length; i++) {
			const el = listContainer.children.item(i);
			if (!muuriItems.includes(el) && el !== null) {
				const htmlEl = el as HTMLElement;
				// Add items as hidden during initial fill (bulk adding doesn't look good)
				if (initialListFill) {
					grid.add(htmlEl, { active: false });
				} else {
					grid.add(htmlEl);
				}
				muuriItems.push(el);
			}
		}
		// Show list after initial fill
		if (initialListFill) {
			grid.show(grid.getItems());
			initialListFill = false;
		}

		// Remove muuri item if not in listContainer HTMLcollection
		muuriItems.forEach((muuriItem) => {
			let found = false;
			for (let i = 0; i < listContainer.children.length; i++) {
				if (listContainer.children.item(i) === muuriItem) {
					found = true;
				}
			}
			if (!found) {
				grid.remove(grid.getItems(muuriItem as HTMLElement));
				muuriItems = muuriItems.filter((item) => item !== muuriItem);
			}
		});
		// Sort dnd list by item order
		grid.sort(function (itemA, itemB) {
			const elA = itemA.getElement();
			const elB = itemB.getElement();
			let orderAttrA = elA ? elA.getAttribute('data-order') : null;
			let orderAttrB = elB ? elB.getAttribute('data-order') : null;

			if (orderAttrA && orderAttrB) {
				return parseInt(orderAttrA) - parseInt(orderAttrB);
			} else {
				return 0;
			}
		});
	});

	onDestroy(() => {
		if (seedListVisibilityTimeout) {
			clearTimeout(seedListVisibilityTimeout);
		}
		grid.destroy();
	});

	function updateDeck(deck: SeedsDeck) {}
</script>

<main class="h-full w-full p-10 m-0">
	<h1 class="text-3xl mb-5">Decks</h1>
	<button class="btn mb-6">New Deck</button>
	<div class="flex flex-col gap-3 relative h-full" bind:this={listContainer}>
		{#each $seedsData.decks as deck}
			<SeedsCategory {deck} />
		{/each}
	</div>
</main>
