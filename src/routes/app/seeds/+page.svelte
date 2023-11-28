<script lang="ts">
	import SeedsDeck from '$components/seeds/SeedsDeck.svelte';
	import { seedsData } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount, setContext } from 'svelte';
	import type Muuri from 'muuri';
	import { initializeDnd, syncDnd } from '$lib/dnd/verticalList';
	import { createDeck, deckFactory, deleteDeck, fillDocs, reorderSeeds } from './decksLogic';
	import { addNewItem, disableNewItemBtn, newItemBtnName } from '$lib/stores/helperStores';

	const scrollContainer = document.getElementById('dnd-scroll-container');
	let listContainer: HTMLElement;
	let dndList: Muuri;
	let dndItems: (Element | null)[] = [];
	let dndInitialListFill = true;
	let dndItemWidth: number;
	let dragInProgress = false;
	let syncTimeoutId: NodeJS.Timeout;
	let initialPosition: number;
	let droppedPosition: number;
	let newDeckId: string;
	let editedDeckId = '';
	let newDeck: SeedsDeckType;
	let reorderData: {
		id: string;
		order: number;
	}[] = [];

	// When deck name is an empty string, automatically set it in edit mode
	// (this could happen when reloading page while creating new deck)
	for (let i = 0; i < $seedsData.decks.length; i++) {
		if ($seedsData.decks[i].name === '') {
			editedDeckId = $seedsData.decks[i].id;
			newDeckId = $seedsData.decks[i].id;
		}
	}

	setContext('handleDeleteDeck', {
		handleDeleteDeck
	});

	function handleCreateDeck() {
		newDeck = deckFactory();
		newDeckId = newDeck.id;
		// New deck is automatically in edit mode
		editedDeckId = newDeck.id;
		createDeck(newDeck);
	}

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
		addNewItem.set(handleCreateDeck);
		newItemBtnName.set('Deck');

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
		// Synchronize to handle stacking order of absolutely positioned deck menus
		dndList.synchronize();
		// Refresh dnd items dimensions after resizing
		dndList.refreshItems();
		dndList.layout();
	});

	onDestroy(() => {
		dndList.remove(dndList.getItems());
		dndList.destroy();
		newItemBtnName.set('');
		disableNewItemBtn.set(false);
		// fillDocs();
	});
</script>

<svelte:window on:resize={keepScrollContainerWidthInSyncWithDecks} />
<main class="h-full w-full py-10 m-0">
	<div class="flex justify-between mb-10">
		<h1 class="text-3xl">Decks</h1>
		<div class="flex items-end">
			<div class="flex items-center">
				<span class="text-xs mr-2">Order by:</span>
				<select class="select select-bordered select-xs max-w-xs self-end pl-3 pr-6 bg-white">
					<option>Custom</option>
					<option>Name</option>
				</select>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-3 relative h-full" bind:this={listContainer}>
		{#each $seedsData.decks as deck (deck.id)}
			{#if newDeckId === deck.id}
				<SeedsDeck
					{deck}
					{dndList}
					{manageEditedDeckId}
					{handleDeleteDeck}
					{editedDeckId}
					newDeck={true}
				/>
				{(newDeckId = '')}
			{:else}
				<SeedsDeck {deck} {dndList} {manageEditedDeckId} {handleDeleteDeck} {editedDeckId} />
			{/if}
		{/each}
	</div>
</main>

<style>
	.select {
		/* Arrow position */
		background-position: calc(100% - 15px) calc(1px + 50%), calc(100% - 11px) calc(1px + 50%);
	}
</style>
