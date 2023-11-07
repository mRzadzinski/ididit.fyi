<script lang="ts">
	import type { SeedsDeck } from '$lib/stores/dbStores';
	import { cloneDeep } from 'lodash';

	export let deck: SeedsDeck;

	const deckClone = cloneDeep(deck);
	let newName = deck.name;
	let newLimit = deck.dailyLimit;
	let editMode = false;
</script>

<div class="absolute mb-6 w-full z-0" data-order={deck.order} id={deck.id}>
	<button
		class="btn h-auto flex items-center justify-between w-full p-2 rounded-xl font-normal normal-case"
	>
		<div class="flex gap-1">
			{#if !editMode}
				<span class="mr-8 ml-3">{deck.name}</span>
				<span>limit: {deck.dailyLimit}</span>
			{:else}
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
			{/if}
		</div>
		<div>
			{#if !editMode}
				<button
					class="btn"
					on:click={() => {
						editMode = true;
					}}>Edit</button
				>
				<button class="btn">Delete</button>
			{:else}
				<button
					class="btn"
					on:click={() => {
						editMode = false;
					}}>Save</button
				>
				<button
					class="btn"
					on:click={() => {
						editMode = false;
					}}>Cancel</button
				>
			{/if}
		</div>
	</button>
</div>
