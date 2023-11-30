<script lang="ts" context="module">
</script>

<script lang="ts">
	import SeedsDeck from '$components/seeds/SeedsDeck.svelte';
	import { seedsData, settings } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount, setContext } from 'svelte';
	import { createDeck, deckFactory, deleteDeck, fillDocs } from './decksLogic';
	import { addNewItem, disableNewItemBtn, newItemBtnName } from '$lib/stores/helperStores';
	import PageHeader from '$components/app-layout/PageHeader.svelte';
	import { decksDndList, decksListContainer, decksScrollContainer } from '$lib/stores/decksStores';
	import {
		decksDndAfterUpdate,
		decksDndOnDestroy,
		decksDndOnMount,
		keepScrollContainerWidthInSyncWithDecks
	} from './dndDecksLogic';

	const scrollContainer = document.getElementById('dnd-scroll-container');
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
		$decksDndList.remove($decksDndList.getItems(dndItem), { removeElements: true });
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

		if (scrollContainer) decksScrollContainer.set(scrollContainer);
		decksListContainer.set(listContainer);
		decksDndOnMount();
	});

	afterUpdate(async () => {
		decksDndAfterUpdate();
	});

	onDestroy(() => {
		decksDndOnDestroy();
		newItemBtnName.set('');
		disableNewItemBtn.set(false);
		// fillDocs();
	});
</script>

<svelte:window on:resize={() => keepScrollContainerWidthInSyncWithDecks()} />
<main class="h-full w-full py-10 m-0">
	<PageHeader
		pageName={'Decks'}
		orderBy={$settings.decksOrderBy}
		orderByOptions={['Custom', 'Name']}
	/>
	<div class="flex flex-col gap-3 relative h-full" bind:this={listContainer}>
		{#each $seedsData.decks as deck (deck.id)}
			{#if newDeckId === deck.id}
				<SeedsDeck
					{deck}
					dndList={$decksDndList}
					{manageEditedDeckId}
					{handleDeleteDeck}
					{editedDeckId}
					newDeck={true}
				/>
				{(newDeckId = '')}
			{:else}
				<SeedsDeck
					{deck}
					dndList={$decksDndList}
					{manageEditedDeckId}
					{handleDeleteDeck}
					{editedDeckId}
				/>
			{/if}
		{/each}
	</div>
</main>
