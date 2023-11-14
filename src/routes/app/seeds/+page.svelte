<script lang="ts">
	import SeedsDeck from '$components/seeds/SeedsDeck.svelte';
	import { seedsData, userDocs } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import Muuri from 'muuri';
	import { syncDnd } from '$lib/dnd/verticalList';
	import { createDeck, deckFactory, deleteDeck, fillDocs, reorderSeeds } from './decksLogic';

	let listContainer: HTMLElement;
	let dndList: Muuri;
	let dndItems: (Element | null)[] = [];
	let dndInitialListFill = true;
	let initialPosition: number;
	let droppedPosition: number;
	let newDeckId: string;

	let newDeck: SeedsDeckType;

	function handleCreateDeck() {
		newDeck = deckFactory();
		newDeckId = newDeck.id;
		createDeck(newDeck);
	}

	function handleDeleteDeck(dndItem: HTMLElement, itemOrder: number) {
		// Removing dnd item first before modifying data, to avoid duplicated HTMLelement from Muuri
		dndList.remove(dndList.getItems(dndItem), { removeElements: true });
		deleteDeck(itemOrder);
	}

	onMount(() => {
		// Initialize drag & drop
		dndList = new Muuri(listContainer, {
			dragEnabled: true,
			dragAxis: 'y',
			dragStartPredicate: (item, e) => {
				const htmlEl = item.getElement();

				if (e.isFinal) {
					Muuri.ItemDrag.defaultStartPredicate(item, e);
					return;
				}

				// Disable dnd for decks in editMode
				if (htmlEl && htmlEl.dataset.editMode === 'true') {
					return false;
				} else {
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
		// fillDocs();
	});
</script>

<main class="h-full w-full p-10 m-0">
	<h1 class="text-3xl mb-5">Decks</h1>
	<button class="btn mb-6" on:click={handleCreateDeck}>New Deck</button>
	<div class="flex flex-col gap-3 relative h-full" bind:this={listContainer}>
		{#each $seedsData.decks as deck (deck.id)}
			{#if newDeckId === deck.id}
				<SeedsDeck {deck} newDeck={true} {handleDeleteDeck} />
				{(newDeckId = '')}
			{:else}
				<SeedsDeck {deck} {handleDeleteDeck} />
			{/if}
		{/each}
	</div>
</main>
