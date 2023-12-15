<script lang="ts">
	import { beforeUpdate, onMount } from 'svelte';
	import ThreeDotsDropdown from '../common/ThreeDotsDropdown.svelte';
	import type Muuri from 'muuri';
	import { seedsData, syncInProgress, userDocs } from '$lib/stores/dbStores';
	import { disableNewItemBtn } from '$lib/stores/helperStores';
	import { goto } from '$app/navigation';
	import ConfirmDeleteDeckModal from './ConfirmDeleteDeckModal.svelte';
	import ModalBackground from '$components/common/ModalBackground.svelte';
	import DeckForm from './DeckForm.svelte';

	export let deck: SeedsDeckType;
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
	<ModalBackground>
		<ConfirmDeleteDeckModal
			deleteHandler={() => handleDeleteDeck(deck.id, dndItem)}
			hideModal={() => toggleShowConfirmDelete(false)}
		/>
	</ModalBackground>
{/if}

<div
	class="absolute mb-3 w-full z-0 {editMode ? 'h-24 cursor-default' : ''}"
	data-order={deck.order}
	data-edit-mode={editMode}
	id={deck.id}
	bind:this={dndItem}
	role="button"
	tabindex="0"
	on:click={() => {
		if (!editMode) goto(`/app/seeds/${deck.name}_Seeds_${deck.id}`);
	}}
	on:keypress={() => {
		if (!editMode) goto(`/app/seeds/${deck.id}`);
	}}
>
	<div
		class="flex justify-between items-center min-w-[496px] w-full h-10 pl-8 pr-1 rounded-3xl custom-transitions
		{newDeck && newDeckInitEditMode ? 'h-0' : ''} 
		{otherDeckInEditMode ? '' : 'hover:bg-[#FFCD4C]'}
		{editMode ? 'h-24 overflow-hidden bg-[#FFCD4C]' : 'bg-[#FEF6DE]'}"
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
</div>

<style>
	.custom-transitions {
		transition: height 300ms ease, background-color 75ms ease-in;
	}
</style>
