<script lang="ts">
	import SeedsDeck from '$components/seeds/SeedsDeck.svelte';
	import { seedsData } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import type Muuri from 'muuri';
	import { initializeDnd, addItemDnd, removeItemDnd, sortListDnd } from '$lib/dnd/verticalList';

	let listContainer: HTMLElement;
	let dndList: Muuri;
	let dndItems: (Element | null)[] = [];
	let dndInitialListFill = true;
	let draggedItemID: string;
	let initialPosition: number;
	let droppedPosition: number;

	onMount(() => {
		// Initialize drag & drop
		dndList = initializeDnd(listContainer);

		// Grid events
		dndList.on('dragInit', function (item, event) {
			const itemEl = item.getElement();
			if (itemEl) {
				draggedItemID = itemEl.id;
				initialPosition = dndList.getItems().indexOf(item);
				console.log(initialPosition);
			}
		});
		dndList.on('dragEnd', function (item, event) {
			droppedPosition = dndList.getItems().indexOf(item);
			console.log(droppedPosition);
		});
	});

	afterUpdate(async () => {
		// Add item to dnd list
		const addItemInfo = addItemDnd(listContainer, dndList, dndItems, dndInitialListFill);
		dndItems = addItemInfo.updatedDndItems;
		dndInitialListFill = addItemInfo.initialListFill;
		// Remove item from dnd list
		dndItems = removeItemDnd(listContainer, dndList, dndItems);
		// Sort dnd list
		sortListDnd(dndList);
	});

	onDestroy(() => {
		dndList.destroy();
	});
</script>

<main class="h-full w-full p-10 m-0">
	<h1 class="text-3xl mb-5">Decks</h1>
	<button class="btn mb-6">New Deck</button>
	<div class="flex flex-col gap-3 relative h-full" bind:this={listContainer}>
		{#each $seedsData.decks as deck}
			<SeedsDeck {deck} />
		{/each}
	</div>
</main>
