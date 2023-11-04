<script lang="ts">
	import SeedsCategory from '$components/seeds/SeedsCategory.svelte';
	import { seedsData } from '$lib/stores/dbStores';
</script>

<main class="h-full w-full p-10 m-0">
	<h1 class="text-3xl mb-5">Decks</h1>
	<button class="btn mb-6">New Deck</button>
	<div class="flex flex-col gap-3">
		{#each $seedsData.decks as deck}
			<SeedsCategory name={deck.name} dailyLimit={deck.dailyLimit} />
		{/each}
	</div>
</main>
