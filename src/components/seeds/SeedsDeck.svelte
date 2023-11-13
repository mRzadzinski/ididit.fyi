<script lang="ts">
	import { cloneDeep } from 'lodash';
	import {
		createDeck,
		incrementAllSeedsOrder,
		updateDeck
	} from '../../routes/app/seeds/seedsLogic';
	import { onMount } from 'svelte';
	import { createId } from '@paralleldrive/cuid2';

	export let deck: SeedsDeckType;
	export let deckCreator = false;
	export let hideDeckCreator = () => {};

	let nameInput: HTMLElement;
	let updatedDeck = deck;
	let newName = deck.name;
	let newLimit = deck.dailyLimit;
	let editMode = false;

	if (deckCreator) {
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

		if (deckCreator) {
			updatedDeck.id = createId();
			updatedDeck.order = 1;
		}
	}

	onMount(() => {
		if (deckCreator) {
			nameInput.focus();
		}
	});
</script>
<!-- Switch from 1 based index in db to 0 for dnd positioning  -->
<div class="absolute mb-6 w-full z-0" data-order={deck.order - 1} id={deck.id}>
	<button
		class="btn h-auto flex items-center justify-between w-full p-2 rounded-xl font-normal normal-case"
	>
		{#if !editMode}
			<div class="flex gap-1 w-1/3">
				<span class="mr-8 ml-3 w-full text-left">{deck.name}</span>
				<span class="w-24">limit: {deck.dailyLimit}</span>
			</div>
			<div>
				<button
					class="btn"
					on:click={() => {
						editMode = true;
					}}>Edit</button
				>
				<button class="btn">Delete</button>
			</div>
		{:else}
			<form
				class="flex items-center justify-between w-full"
				on:submit|preventDefault={() => {
					editMode = false;
					if (deckCreator) {
						prepareDeckUpdate();
						incrementAllSeedsOrder();
						createDeck(updatedDeck);
						hideDeckCreator();
					} else if (newName !== deck.name || newLimit !== deck.dailyLimit) {
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
							if (deckCreator) {
								hideDeckCreator();
							} else {
								cancelChanges();
							}
						}}>Cancel</button
					>
				</div>
			</form>
		{/if}
	</button>
</div>
