<script lang="ts">
	import { beforeUpdate, onMount } from 'svelte';
	import ThreeDotsDropdown from '../common/ThreeDotsDropdown.svelte';
	import type Muuri from 'muuri';
	import { seedsData } from '$lib/stores/dbStores';
	import { disableNewItemBtn } from '$lib/stores/helperStores';
	import DeckConfirmDeleteModal from './DeckConfirmDeleteModal.svelte';
	import DeckForm from './DeckForm.svelte';
	import DeckDndItem from './DeckDndItem.svelte';

	export let deck: DeckType;
	export let newDeck = false;
	export let editedDeckId: string;
	export let dndList: Muuri;
	export let manageEditedDeckId: Function;
	export let handleDeleteDeck: (itemId: string, dndItem: HTMLElement) => void;

	let dndItem: HTMLElement;
	let seedsInDeck: boolean;
	let editMode = false;
	let newDeckInitEditMode = true;
	let otherDeckInEditMode = false;
	let newName = deck.name;
	let newLimit = deck.dailyLimit;
	let showDeckOptions = false;
	let showConfirmDelete = false;

	function getNewName(value: string) {
		newName = value;
	}
	function getNewLimit(value: number) {
		newLimit = value;
	}
	function getDndItem(item: HTMLElement) {
		dndItem = item;
	}

	function toggleShowConfirmDelete(bool: boolean) {
		if (bool) {
			showConfirmDelete = true;
		} else {
			showConfirmDelete = false;
		}
	}

	function checkIfSeedsInDeck() {
		for (let i = 0; i < $seedsData.decks.length; i++) {
			const scannedDeck = $seedsData.decks[i];
			if (scannedDeck.id === deck.id && scannedDeck.seeds.length > 0) {
				seedsInDeck = true;
			}
		}
	}

	function toggleDeckOptionsVisibility(bool: boolean) {
		// Timeout to sync with highlight animation
		if (bool) {
			setTimeout(() => {
				showDeckOptions = true;
			}, 75);
		} else {
			setTimeout(() => {
				showDeckOptions = false;
			}, 75);
		}
	}

	function cancelChanges() {
		newName = deck.name;
		newLimit = deck.dailyLimit;
	}

	function handleToggleEdit(action: string) {
		if (action === 'enable') {
			editMode = true;
			disableNewItemBtn.set(true);
		} else {
			editMode = false;
			disableNewItemBtn.set(false);
		}
		// Refresh dndList asynchronously to wait for applied UI changes
		setTimeout(() => {
			dndList.refreshItems();
			dndList.layout();
		}, 0);
		// manageEditedDeckId triggers props update from parent component which collides with UI animation, wait for animation end
		setTimeout(() => {
			manageEditedDeckId(action, deck.id);
		}, 300);
	}

	onMount(() => {
		if (newDeck) {
			disableNewItemBtn.set(true);
			// Handle new deck animation
			setTimeout(() => {
				// Set edit mode asynchronously to trigger conditional class changes
				newDeckInitEditMode = false;
				editMode = true;
			}, 0);
		}
	});

	beforeUpdate(() => {
		if (editedDeckId.length > 0 && editedDeckId !== deck.id) {
			otherDeckInEditMode = true;
			editMode = false;
			cancelChanges();
			toggleDeckOptionsVisibility(false);
		} else {
			otherDeckInEditMode = false;
		}
	});
</script>

{#if showConfirmDelete}
	<DeckConfirmDeleteModal
		deleteHandler={() => handleDeleteDeck(deck.id, dndItem)}
		hideModal={() => toggleShowConfirmDelete(false)}
	/>
{/if}

<DeckDndItem {deck} {editMode} {getDndItem}>
	<div
		class="flex justify-between items-center min-w-[496px] w-full h-10 pl-[1.87rem] pr-1 rounded-3xl custom-transitions
	{newDeck && newDeckInitEditMode ? 'h-0' : ''} 
	{otherDeckInEditMode ? '' : 'hover:bg-[#FFCD4C]'}
	{editMode ? 'h-[5.625rem] overflow-hidden bg-[#FFCD4C]' : 'bg-[#FEF6DE]'}"
		role="listitem"
		on:mouseenter={() => {
			if (!otherDeckInEditMode) toggleDeckOptionsVisibility(true);
		}}
		on:mouseleave={() => toggleDeckOptionsVisibility(false)}
	>
		{#if !editMode}
			<span class="text-sm max-w-full whitespace-nowrap text-ellipsis truncate mr-8">{newName}</span
			>
			<div class={showDeckOptions ? '' : 'invisible'}>
				<ThreeDotsDropdown
					itemId={deck.id}
					options={[
						{
							name: 'Edit',
							handler: () => handleToggleEdit('enable')
						},
						{
							name: 'Delete',
							handler: () => {
								checkIfSeedsInDeck();
								if (seedsInDeck) {
									toggleShowConfirmDelete(true);
								} else {
									handleDeleteDeck(deck.id, dndItem);
								}
							}
						}
					]}
				/>
			</div>
		{:else}
			<DeckForm
				{deck}
				{newDeck}
				{dndList}
				{dndItem}
				{handleDeleteDeck}
				{handleToggleEdit}
				{getNewName}
				{getNewLimit}
				{cancelChanges}
			/>
		{/if}
	</div>
</DeckDndItem>

<style>
	.custom-transitions {
		transition: height 300ms ease, background-color 75ms ease-in;
	}
</style>
