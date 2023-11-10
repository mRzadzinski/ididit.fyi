<script lang="ts">
	import SeedsDeck from '$components/seeds/SeedsDeck.svelte';
	import { seedsData, userDocs } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import type Muuri from 'muuri';
	import { initializeDnd, syncDnd, sortListDnd } from '$lib/dnd/verticalList';
	import { fillDocs, reorderSeeds } from './seedsLogic';

	// $: console.log($seedsData)
	$: console.log($userDocs)
	let listContainer: HTMLElement;
	let dndList: Muuri;
	let dndItems: (Element | null)[] = [];
	let dndInitialListFill = true;
	let initialPosition: number;
	let droppedPosition: number;

	onMount(() => {
		// Initialize drag & drop
		dndList = initializeDnd(listContainer);

		// Grid events
		dndList.on('dragInit', function (item, event) {
			const itemEl = item.getElement();
			if (itemEl) {
				initialPosition = dndList.getItems().indexOf(item);
			}
		});
		dndList.on('dragEnd', function (item, event) {
			droppedPosition = dndList.getItems().indexOf(item);
			if (initialPosition !== droppedPosition) {
				reorderSeeds(initialPosition, droppedPosition);
			}
		});
	});

	afterUpdate(async () => {
		// Keep dnd list in sync with listContainer and update reference array
		const dndSyncInfo = syncDnd(listContainer, dndList, dndItems, dndInitialListFill);
		dndItems = dndSyncInfo.updatedDndItems;
		dndInitialListFill = dndSyncInfo.initialListFill;
	});

	onDestroy(() => {
		dndList.destroy();
		fillDocs();
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
