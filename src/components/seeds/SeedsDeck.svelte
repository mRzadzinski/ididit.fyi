<script lang="ts">
	import { cloneDeep } from 'lodash';
	import { updateDeck } from '../../routes/app/seeds/decksLogic';
	import { beforeUpdate, onMount } from 'svelte';
	import DeckOptions from './DeckOptions.svelte';
	import type Muuri from 'muuri';

	export let deck: SeedsDeckType;
	export let newDeck = false;
	export let editedDeckId: string;
	export let dndList: Muuri;
	export let manageEditedDeckId: (action: string, id: string) => void;

	let dndItem: HTMLElement;
	let nameInput: HTMLElement;
	let editMode = false;
	let newDeckInitEditMode = true;
	let otherDeckInEditMode = false;
	let updatedDeck = deck;
	let newName = deck.name;
	let newLimit = deck.dailyLimit;
	let showDeckOptions = false;

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

	function prepareDeckUpdate() {
		updatedDeck = cloneDeep(deck);
		updatedDeck.name = newName;

		if (newLimit < 0 || newLimit === null) {
			updatedDeck.dailyLimit = 0;
			newLimit = 0;
		} else {
			updatedDeck.dailyLimit = newLimit;
		}
	}

	function handleToggleEdit(action: string) {
		if (action === 'enable') {
			editMode = true;
		} else {
			editMode = false;
		}
		// Refresh dndList asynchronously to wait for applied UI changes
		const intervalID = setTimeout(() => {
			dndList.refreshItems();
			dndList.layout();
		}, 0);
		// manageEditedDeckId triggers props update from parent component which collides with UI animation, wait for animation end
		setTimeout(() => {
			manageEditedDeckId(action, deck.id);
		}, 300);
	}

	onMount(() => {
		// Handle new deck animation - apply changes asynchronously
		if (newDeck) {
			setTimeout(() => {
				newDeckInitEditMode = false;
				editMode = true;
				setTimeout(() => {
					dndList.refreshItems();
					dndList.layout();
					nameInput.focus();
				}, 0);
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

<div
	class="absolute mb-4 w-full z-0 {editMode ? 'h-24' : ''}"
	data-order={deck.order}
	data-edit-mode={editMode}
	id={deck.id}
	bind:this={dndItem}
>
	<div
		class="flex justify-between items-center w-full h-10 bg-[#FEF6DE] pl-8 pr-1 rounded-3xl custom-transitions
		{newDeck && newDeckInitEditMode ? 'h-0' : ''} 
		{otherDeckInEditMode ? '' : 'hover:bg-[#FFCD4C]'}
		{editMode ? 'h-24 overflow-hidden bg-[#FFCD4C]' : ''}"
		role="listitem"
		on:mouseenter={() => {
			if (!otherDeckInEditMode) toggleDeckOptionsVisibility(true);
		}}
		on:mouseleave={() => toggleDeckOptionsVisibility(false)}
	>
		{#if !editMode}
			<span class="text-sm">{deck.name}</span>
			{#if showDeckOptions}
				<DeckOptions deckId={deck.id} {dndItem} {handleToggleEdit} />
			{/if}
		{:else}
			<form
				class="flex flex-col w-full"
				on:submit|preventDefault={async () => {
					if (newName !== deck.name || newLimit !== deck.dailyLimit) {
						prepareDeckUpdate();
						updateDeck(updatedDeck);
					}
					handleToggleEdit('disable');
				}}
			>
				<input
					class="input input-bordered w-full max-w-xs input-sm"
					type="text"
					placeholder="Deck name"
					bind:value={newName}
					bind:this={nameInput}
				/>
				<div class="flex justify-between gap-1">
					<div class="text-sm">
						<span>Show</span>
						<input
							class="input input-bordered w-24 max-w-xs input-sm"
							type="number"
							placeholder="Daily limit"
							min="0"
							bind:value={newLimit}
						/>
						<span>seeds in Daily Review</span>
					</div>
					<div>
						<button
							class="btn"
							type="reset"
							on:click={() => {
								handleToggleEdit('disable');
								cancelChanges();
								toggleDeckOptionsVisibility(false);
							}}>Cancel</button
						>
						<button
							class="btn"
							type="submit"
							on:click={() => {
								toggleDeckOptionsVisibility(false);
							}}>Save</button
						>
					</div>
				</div>
			</form>
		{/if}
	</div>
</div>

<style>
	.custom-transitions {
		transition: height 300ms ease, background-color 75ms ease-in;
	}
</style>
