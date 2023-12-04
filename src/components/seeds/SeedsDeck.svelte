<script lang="ts">
	import { cloneDeep } from 'lodash';
	import { updateDeck } from '../../routes/app/seeds/decksLogic';
	import { beforeUpdate, onMount } from 'svelte';
	import ThreeDotsDropdown from '../common/ThreeDotsDropdown.svelte';
	import type Muuri from 'muuri';
	import { seedsDecks, syncInProgress } from '$lib/stores/dbStores';
	import { disableNewItemBtn } from '$lib/stores/helperStores';
	import { goto } from '$app/navigation';

	export let deck: SeedsDeckType;
	export let newDeck = false;
	export let editedDeckId: string;
	export let dndList: Muuri;
	export let manageEditedDeckId: Function;
	export let handleDeleteDeck: Function;

	let dndItem: HTMLElement;
	let nameInput: HTMLInputElement;
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

	function validateDeckName() {
		// Ensure deck name is not empty
		if (newName === '') {
			nameInput.setCustomValidity(`Name your deck.`);
			return;
		}

		for (let i = 0; i < $seedsDecks.length; i++) {
			// Ensure deck name in unique
			if ($seedsDecks[i].name === newName && newName !== deck.name) {
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
	class="absolute mb-4 w-full z-0 {editMode ? 'h-24 cursor-default' : ''}"
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
			<span class="text-sm max-w-full whitespace-nowrap text-ellipsis truncate mr-8"
				>{deck.name}</span
			>
			<div class={showDeckOptions ? '' : 'invisible'}>
				<ThreeDotsDropdown
					itemId={deck.id}
					options={[
						{
							name: 'Edit',
							handlers: [() => handleToggleEdit('enable')]
						},
						{
							name: 'Delete',
							handlers: [() => handleDeleteDeck(deck.id, dndItem)]
						}
					]}
				/>
			</div>
		{:else}
			<form
				class="flex flex-col gap-2 w-full"
				on:submit|preventDefault={async () => {
					// Enable sync animation on start of exit-edit-mode animation
					// updateDeck disables sync animation when successful
					syncInProgress.set(true);
					handleToggleEdit('disable');
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
					maxlength="60"
					bind:value={newName}
					bind:this={nameInput}
					on:input={validateDeckName}
				/>
				<div class="flex justify-between gap-1">
					<div class="flex items-center gap-2 text-sm">
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
					<div class="flex gap-2 mr-2">
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
		{/if}
	</div>
</div>

<style>
	.custom-transitions {
		transition: height 300ms ease, background-color 75ms ease-in;
	}

	.btn {
		width: 5.5rem;
		font-size: small;
	}

	.input.input-sm {
		padding-right: 0;
		padding-left: 0.75rem;
	}
</style>
