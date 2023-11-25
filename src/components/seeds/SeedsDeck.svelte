<script lang="ts">
	import { cloneDeep } from 'lodash';
	import { updateDeck } from '../../routes/app/seeds/decksLogic';
	import { beforeUpdate, onMount } from 'svelte';
	import DeckOptions from './DeckOptions.svelte';

	export let deck: SeedsDeckType;
	export let newDeck = false;
	export let editedDeckId: string;
	export let manageEditedDeckId: (action: string, id: string) => void;

	let dndItem: HTMLElement;
	let nameInput: HTMLElement;
	let editMode = false;
	let updatedDeck = deck;
	let newName = deck.name;
	let newLimit = deck.dailyLimit;
	let showDeckOptions = false;

	if (newDeck) {
		editMode = true;
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

	function handleEdit() {
		manageEditedDeckId('enable', deck.id);
		editMode = true;
	}

	onMount(() => {
		if (newDeck) {
			nameInput.focus();
		}
	});

	beforeUpdate(() => {
		if (editedDeckId.length > 0 && editedDeckId !== deck.id) {
			editMode = false;
			cancelChanges();
		}
	});
</script>

<div
	class="absolute mb-4 w-full z-0"
	data-order={deck.order}
	data-edit-mode={editMode}
	id={deck.id}
	bind:this={dndItem}
>
	<div
		class="flex justify-between items-center w-full h-10 pl-8 pr-1 bg-[#FEF6DE] rounded-full hover:bg-[#FFCD4C] transition-all ease-in duration-75"
		role="listitem"
		on:mouseenter={() => toggleDeckOptionsVisibility(true)}
		on:mouseleave={() => toggleDeckOptionsVisibility(false)}
	>
		{#if !editMode}
			<span class="text-sm">{deck.name}</span>
			{#if showDeckOptions}
				<DeckOptions deckId={deck.id} {dndItem} {handleEdit} />
			{/if}
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
					<button class="btn" type="submit" on:click={() => manageEditedDeckId('disable', deck.id)}
						>Save</button
					>
					<button
						class="btn"
						type="reset"
						on:click={() => {
							editMode = false;
							manageEditedDeckId('disable', deck.id);
							cancelChanges();
						}}>Cancel</button
					>
				</div>
			</form>
		{/if}
	</div>
</div>
