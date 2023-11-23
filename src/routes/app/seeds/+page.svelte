<script lang="ts">
	import SeedsDeck from '$components/seeds/SeedsDeck.svelte';
	import { seedsData } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import type Muuri from 'muuri';
	import { initializeDnd, syncDnd } from '$lib/dnd/verticalList';
	import { createDeck, deckFactory, deleteDeck, fillDocs, reorderSeeds } from './decksLogic';
	import { addNewItem } from '$lib/stores/helperStores';

	const scrollContainer = document.getElementById('dnd-scroll-container');
	let listContainer: HTMLElement;
	let dndList: Muuri;
	let dndItems: (Element | null)[] = [];
	let dndInitialListFill = true;
	let dndItemWidth: number;
	let dragInProgress = false;
	let reorderData: {
		id: string;
		order: number;
	}[] = [];
	let syncTimeoutId: NodeJS.Timeout;
	let initialPosition: number;
	let droppedPosition: number;
	let newDeckId: string;
	let editedDeckId = '';
	let newDeck: SeedsDeckType;

	function handleCreateDeck() {
		newDeck = deckFactory();
		newDeckId = newDeck.id;
		// New deck is automatically in edit mode
		editedDeckId = newDeck.id;
		createDeck(newDeck);
	}
	addNewItem.set(handleCreateDeck);

	function handleDeleteDeck(dndItem: HTMLElement, itemId: string) {
		// Removing dnd item first before modifying data, to avoid duplicated HTMLelement from Muuri
		dndList.remove(dndList.getItems(dndItem), { removeElements: true });
		deleteDeck(itemId);
	}

	function keepScrollContainerWidthInSyncWithDecks() {
		const dndItemWidth = dndList.getItem(0)?.getElement()?.children[0].clientWidth;
		if (scrollContainer) {
			scrollContainer.style.width = `${dndItemWidth}px`;
		}
	}

	// Sync dnd in case of animation glitch after too fast dnd actions
	function fallbackSyncDnd() {
		clearTimeout(syncTimeoutId);

		syncTimeoutId = setTimeout(() => {
			if (!dragInProgress) {
				const dndSyncInfo = syncDnd(listContainer, dndList, dndItems, dndInitialListFill);
				dndItems = dndSyncInfo.updatedDndItems;
				dndInitialListFill = dndSyncInfo.initialListFill;
			} else {
				fallbackSyncDnd();
			}
		}, 1500);
	}

	// Allow only one deck to have edit mode enabled
	function manageEditedDeckId(action: string, id: string) {
		if (action === 'enable') {
			editedDeckId = id;
		} else if (action === 'disable' && editedDeckId === id) {
			editedDeckId = '';
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

	onMount(() => {
		// Initialize drag & drop
		if (scrollContainer) {
			dndList = initializeDnd(listContainer, scrollContainer);
		}

		// Grid events
		dndList.on('dragInit', function (item, event) {
			const itemEl = item.getElement();

			// Save index for reorder
			if (itemEl) {
				initialPosition = dndList.getItems().indexOf(item);
			}
		});
		dndList.on('dragStart', () => {
			dragInProgress = true;
		});
		dndList.on('dragEnd', function (item, event) {
			droppedPosition = dndList.getItems().indexOf(item);
		});
		dndList.on('dragReleaseEnd', (item) => {
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
	});

	afterUpdate(async () => {
		// Keep dnd list in sync with listContainer and update reference array
		const dndSyncInfo = syncDnd(listContainer, dndList, dndItems, dndInitialListFill);
		dndItems = dndSyncInfo.updatedDndItems;
		dndInitialListFill = dndSyncInfo.initialListFill;
	});

	onDestroy(() => {
		dndList.remove(dndList.getItems());
		dndList.destroy();
		// fillDocs();
	});
</script>

<svelte:window on:resize={keepScrollContainerWidthInSyncWithDecks} />
<main class="h-full w-full p-10 m-0">
	<h1 class="text-3xl mb-5">Decks</h1>
	<div class="flex flex-col gap-3 relative h-full" bind:this={listContainer}>
		{#each $seedsData.decks as deck (deck.id)}
			{#if newDeckId === deck.id}
				<SeedsDeck {deck} {handleDeleteDeck} {manageEditedDeckId} {editedDeckId} newDeck={true} />
				{(newDeckId = '')}
			{:else}
				<SeedsDeck {deck} {handleDeleteDeck} {manageEditedDeckId} {editedDeckId} />
			{/if}
		{/each}
	</div>
</main>
