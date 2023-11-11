<script lang="ts">
	import SeedsDeck from '$components/seeds/SeedsDeck.svelte';
	import { seedsData } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import Muuri from 'muuri';
	import { syncDnd } from '$lib/dnd/verticalList';
	import { deckFactory, fillDocs, reorderSeeds } from './seedsLogic';

	let listContainer: HTMLElement;
	let dndList: Muuri;
	let dndItems: (Element | null)[] = [];
	let dndInitialListFill = true;
	let initialPosition: number;
	let droppedPosition: number;

	let showDeckCreator = false;
	let newDeck: SeedsDeckType;

	function createNewDeck() {
		newDeck = deckFactory();
		showDeckCreator = true;
	}

	function hideDeckCreator() {
		showDeckCreator = false;
	}
	onMount(() => {
		// Initialize drag & drop
		dndList = new Muuri(listContainer, {
			dragEnabled: true,
			dragAxis: 'y',
			dragStartPredicate: (item, e) => {
				if (e.isFinal) {
					Muuri.ItemDrag.defaultStartPredicate(item, e);
					return;
				}
				// Prevent first item from being dragged when deckCreator is on
				if (dndList.getItems()[0] === item && showDeckCreator) {
					return false;
				}
				// For other items use the default drag start predicate.
				return true;
			},
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
		dndList.remove(dndList.getItems());

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
	<button class="btn mb-6" on:click={createNewDeck}>New Deck</button>
	<div class="flex flex-col gap-3 relative h-full" bind:this={listContainer}>
		{#if showDeckCreator}
			<SeedsDeck deck={newDeck} deckCreator={true} {hideDeckCreator} />
		{/if}
		{#each $seedsData.decks as deck (deck.id)}
			<SeedsDeck {deck} />
		{/each}
	</div>
</main>
