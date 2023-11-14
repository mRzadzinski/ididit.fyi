<script lang="ts">
	import { cloneDeep } from 'lodash';
	import { deleteDeck, updateDeck } from '../../routes/app/seeds/decksLogic';
	import { onMount } from 'svelte';

	export let deck: SeedsDeckType;
	export let newDeck = false;
	export let handleDeleteDeck: (dndItem: HTMLElement, itemOrder: number) => void;

	let dndItem: HTMLElement;
	let nameInput: HTMLElement;
	let editMode = false;
	let updatedDeck = deck;
	let newName = deck.name;
	let newLimit = deck.dailyLimit;

	if (newDeck) {
		editMode = true;
	}

	function cancelChanges() {
		newName = deck.name;
		newLimit = deck.dailyLimit;
	}

	function prepareDeckUpdate() {
		updatedDeck = cloneDeep(deck);
		updatedDeck.name = newName;

		if (newLimit === null) {
			updatedDeck.dailyLimit = 0;
			newLimit = 0;
		} else {
			updatedDeck.dailyLimit = newLimit;
		}
	}

	onMount(() => {
		if (newDeck) {
			nameInput.focus();
		}
	});
</script>

<div class="absolute mb-6 w-full z-0" data-order={deck.order} data-edit-mode={editMode} id={deck.id} bind:this={dndItem}>
	<button
		class="btn h-auto flex items-center justify-between w-full p-2 rounded-xl font-normal normal-case"
	>
		{#if !editMode}
			<div class="flex gap-1 w-1/3">
				<span class="mr-8 ml-3 w-full text-left">{deck.name}</span>
				<!-- <span class="w-24">limit: {deck.dailyLimit}</span> -->
				<span class="w-24">order: {deck.order}</span>
			</div>
			<div>
				<button
					class="btn"
					on:click={() => {
						editMode = true;
					}}>Edit</button
				>
				<button
					class="btn"
					on:click={async () => {
						handleDeleteDeck(dndItem, deck.order);
					}}>Delete</button
				>
			</div>
		{:else}
			<form
				class="flex items-center justify-between w-full"
				on:submit|preventDefault={async () => {
					editMode = false;
					if (newName !== deck.name || newLimit !== deck.dailyLimit) {
						prepareDeckUpdate();
						updateDeck(updatedDeck);
					}
				}}
			>
				<div class="flex gap-1">
					<input
						class="input input-bordered w-full max-w-xs input-sm"
						type="text"
						placeholder="Deck name"
						bind:value={newName}
						bind:this={nameInput}
					/>
					<input
						class="input input-bordered w-24 max-w-xs input-sm"
						type="number"
						placeholder="Daily limit"
						bind:value={newLimit}
					/>
				</div>
				<div>
					<button class="btn" type="submit">Save</button>
					<button
						class="btn"
						type="reset"
						on:click={() => {
							editMode = false;

							cancelChanges();
						}}>Cancel</button
					>
				</div>
			</form>
		{/if}
	</button>
</div>
