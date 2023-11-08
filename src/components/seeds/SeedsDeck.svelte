<script lang="ts">
	import { cloneDeep } from 'lodash';

	export let deck: SeedsDeckType;
	export let updateDeck: (deck: SeedsDeckType) => void;

	let deckUpdate = deck;
	let newName = deck.name;
	let newLimit = deck.dailyLimit;
	let editMode = false;

	function cancelChanges() {
		newName = deck.name;
		newLimit = deck.dailyLimit;
	}

	const longString = generateRandomPassword(920000);
	function prepareDeckUpdate() {
		// newName = longString;

		deckUpdate = cloneDeep(deck);
		deckUpdate.name = newName + longString;
		deckUpdate.dailyLimit = newLimit;
	}

	export function generateRandomPassword(passLength: number) {
		const strValues = 'abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+-=';
		let password = '';
		let tempStr: string;
		for (let i = 0; i < passLength; i++) {
			tempStr = strValues.charAt(Math.round(strValues.length * Math.random()));
			password = password + tempStr;
		}
		return password;
	}
</script>

<div class="absolute mb-6 w-full z-0" data-order={deck.order} id={deck.id}>
	<button
		class="btn h-auto flex items-center justify-between w-full p-2 rounded-xl font-normal normal-case"
	>
		{#if !editMode}
			<div class="flex gap-1">
				<span class="mr-8 ml-3">{deck.name}</span>
				<span>limit: {deck.dailyLimit}</span>
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
			<div class="flex gap-1">
				<input
					class="input input-bordered w-full max-w-xs input-sm"
					type="text"
					placeholder="Deck name"
					bind:value={newName}
					on:input={() => {
						console.log(newName);
					}}
				/>
				<input
					class="input input-bordered w-24 max-w-xs input-sm"
					type="number"
					placeholder="Daily limit"
					bind:value={newLimit}
				/>
			</div>
			<div>
				<button
					class="btn"
					on:click={() => {
						editMode = false;
						if (newName !== deck.name || newLimit !== deck.dailyLimit) {
							prepareDeckUpdate();
							updateDeck(deckUpdate);
						}
					}}>Save</button
				>
				<button
					class="btn"
					on:click={() => {
						editMode = false;
						cancelChanges();
					}}>Cancel</button
				>
			</div>
		{/if}
	</button>
</div>
