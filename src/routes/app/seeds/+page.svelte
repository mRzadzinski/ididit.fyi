<script lang="ts">
	import SeedsDeck from '$components/seeds/SeedsDeck.svelte';
	import PageHeader from '$components/app-layout/PageHeader.svelte';
	import {
		dndList,
		dndListContainer,
		dndReorderDbData,
		whereDndIsActive
	} from '$lib/stores/dndStores';
	import { seedsData, settings } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import {
		createDeck,
		deckFactory,
		decksOrderByOptions,
		deleteDeck,
		fillDocs,
		reorderDecks
	} from './decksLogic';
	import { addNewItem, disableNewItemBtn, newItemBtnName } from '$lib/stores/helperStores';
	import {
		dndListAfterUpdate,
		dndListOnDestroy,
		dndListOnMount
	} from '../../../lib/dnd/verticalListLifecycle';

	let listContainer: HTMLElement;
	let newDeckId: string;
	let editedDeckId = '';
	let newDeck: SeedsDeckType;

	// When deck name is an empty string, automatically set it in edit mode
	// (this could happen when reloading page while creating new deck)
	for (let i = 0; i < $seedsData.decks.length; i++) {
		if ($seedsData.decks[i].name === '') {
			editedDeckId = $seedsData.decks[i].id;
			newDeckId = $seedsData.decks[i].id;
		}
	}

	function handleCreateDeck() {
		newDeck = deckFactory();
		newDeckId = newDeck.id;
		// New deck is automatically in edit mode
		editedDeckId = newDeck.id;
		createDeck(newDeck);
	}

	function handleDeleteDeck(itemId: string, dndItem: HTMLElement) {
		// Removing dnd item first before modifying data, to avoid duplicated HTMLelement from Muuri
		$dndList.remove($dndList.getItems(dndItem), { removeElements: true });
		deleteDeck(itemId);
	}

	// Allow only one deck to have edit mode enabled
	function manageEditedDeckId(action: string, id: string) {
		if (action === 'enable') {
			editedDeckId = id;
		} else if (action === 'disable' && editedDeckId === id) {
			editedDeckId = '';
		}
	}

	onMount(() => {
		addNewItem.set(handleCreateDeck);
		newItemBtnName.set('Deck');
		whereDndIsActive.set('decks');
		dndReorderDbData.set(reorderDecks);
		dndListContainer.set(listContainer);
		dndListOnMount();
	});

	afterUpdate(async () => {
		dndListAfterUpdate();
	});

	onDestroy(() => {
		newItemBtnName.set('');
		disableNewItemBtn.set(false);
		dndListOnDestroy();
		// fillDocs();
	});
</script>

<PageHeader
	pageName="Decks"
	orderBy={$settings.decksOrderBy}
	orderByOptions={decksOrderByOptions}
	whereToUpdateOrder="decks"
/>
<div class="flex flex-col gap-3 relative h-full" bind:this={listContainer}>
	{#each $seedsData.decks as deck (deck.id)}
		{#if newDeckId === deck.id}
			<SeedsDeck
				{deck}
				dndList={$dndList}
				{handleDeleteDeck}
				{manageEditedDeckId}
				{editedDeckId}
				newDeck={true}
			/>
			{(newDeckId = '')}
		{:else}
			<SeedsDeck {deck} dndList={$dndList} {manageEditedDeckId} {handleDeleteDeck} {editedDeckId} />
		{/if}
	{/each}
</div>
