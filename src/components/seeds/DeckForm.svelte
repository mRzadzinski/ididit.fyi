<script lang="ts">
	import { seedsData, syncInProgress } from '$lib/stores/dbStores';
	import { cloneDeep } from 'lodash';
	import { updateDeck } from '../../routes/app/seeds/decksLogic';
	import { onMount } from 'svelte';
	import type Muuri from 'muuri';

	export let deck: SeedsDeckType;
	export let newDeck: boolean;
	export let dndList: Muuri;
	export let dndItem: HTMLElement;
	export let handleDeleteDeck: (itemId: string, dndItem: HTMLElement) => void;
	export let handleToggleEdit: (action: string) => void;
	export let getNewName: (value: string) => void;
	export let getNewLimit: (value: number) => void;
	export let cancelChanges: () => void;

	let nameInput: HTMLInputElement;
	let newName = deck.name;
	let newLimit = deck.dailyLimit;
	let updatedDeck = deck;

	function validateDeckName() {
		// Ensure deck name is not empty
		if (newName === '') {
			nameInput.setCustomValidity(`Name your deck.`);
			return;
		}

		for (let i = 0; i < $seedsData.decks.length; i++) {
			// Ensure deck name in unique
			if ($seedsData.decks[i].name === newName && newName !== deck.name) {
				nameInput.setCustomValidity(`Deck '${newName}' already exists - try something different.`);
				return;
			} else {
				nameInput.setCustomValidity('');
			}
		}
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

	onMount(() => {
		// Refresh dndList constantly for 1 sec to enable animation in case of edit mode enabled for new deck on page load
		let counter = 0;
		const intervalID = setInterval(() => {
			// When going to another page, interval isn't cleared - terminate loop when input is destroyed
			if (counter > 1000 || !nameInput) {
				clearInterval(intervalID);
				return;
			}
			dndList.refreshItems();
			dndList.layout();
			nameInput.focus();

			counter += 50;
		}, 50);
	});
</script>

<form
	class="flex flex-col gap-2 w-full"
	on:submit|preventDefault={async () => {
		// Enable sync animation on start of exit-edit-mode animation
		// updateDeck disables sync animation when successful
		syncInProgress.set(true);
		handleToggleEdit('disable');
		getNewName(newName);
		getNewLimit(newLimit);
		if (newName !== deck.name || newLimit !== deck.dailyLimit) {
			// Wait for animation end
			setTimeout(() => {
				prepareDeckUpdate();
				updateDeck(updatedDeck);
			}, 300);
		}
	}}
>
	<input
		class="input input-sm input-bordered w-full max-w-xs rounded-lg"
		type="text"
		placeholder="Deck name"
		maxlength="200"
		bind:value={newName}
		bind:this={nameInput}
		on:input={validateDeckName}
	/>
	<div class="flex justify-between gap-1">
		<div class="flex items-center gap-[0.37rem] text-sm">
			<span>Show</span>
			<input
				class="input input-sm input-bordered w-16 rounded-lg"
				id="daily-review-limit-input"
				type="number"
				min="0"
				max="9999"
				bind:value={newLimit}
				on:change={validateDeckName}
			/>
			<span>seeds in Daily Review</span>
		</div>
		<div class="flex gap-[0.62rem] mr-[0.62rem]">
			<button
				class="btn btn-sm bg-white"
				type="reset"
				on:click={(e) => {
					e.stopPropagation();

					// Delete new deck without name on cancel
					if (newDeck && deck.name === '') {
						handleDeleteDeck(deck.id, dndItem);
					} else {
						cancelChanges();
					}
					handleToggleEdit('disable');
				}}>Cancel</button
			>
			{#if newName !== deck.name || newLimit !== deck.dailyLimit}
				<button class="btn btn-sm btn-neutral bg-black" type="submit">Save</button>
			{:else}
				<button
					class="btn btn-sm btn-neutral btn-disabled"
					tabindex="-1"
					aria-disabled="true"
					type="submit">Save</button
				>
			{/if}
		</div>
	</div>
</form>

<style>
	.btn {
		height: 1.75rem;
		min-height: 1.75rem;
		width: 5.5rem;
		font-size: small;
		font-size: 0.75rem;
	}

	.input.input-sm {
		padding-right: 0;
		padding-left: 0.75rem;
		height: 1.63rem;
	}
</style>
