<script lang="ts">
	import SeedsCategory from '$components/seeds/SeedsCategory.svelte';
	import { seedsData } from '$lib/stores/dbStores';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import Muuri from 'muuri';

	let listContainer: HTMLElement;
	let grid: Muuri;
	let muuriItems: (Element | null)[] = [];

	onMount(() => {
		// Initialize drag & drop
		grid = new Muuri(listContainer, { dragEnabled: true });
		// Clear grid if not empty
		grid.remove(grid.getItems());
	});

	afterUpdate(() => {
		// Add item to muuri if missing
		for (let i = 0; i < listContainer.children.length; i++) {
			const el = listContainer.children.item(i);
			if (!muuriItems.includes(el) && el !== null) {
				grid.add(el as HTMLElement);
				muuriItems.push(el);
			}
		}
		// Remove muuri item if not in listContainer HTMLcollection
		muuriItems.forEach((muuriItem) => {
			let found = false;
			for (let i = 0; i < listContainer.children.length; i++) {
				if (listContainer.children.item(i) === muuriItem) {
					found = true;
				}
			}
			if (!found) {
				grid.remove(grid.getItems(muuriItem as HTMLElement));
				muuriItems = muuriItems.filter((item) => item !== muuriItem);
			}
		});
		// Sort dnd list by item order
		grid.sort(function (itemA, itemB) {
			const elA = itemA.getElement();
			const elB = itemB.getElement();
			let orderAttrA = elA ? elA.getAttribute('data-order') : null;
			let orderAttrB = elB ? elB.getAttribute('data-order') : null;

			if (orderAttrA && orderAttrB) {
				return parseInt(orderAttrA) - parseInt(orderAttrB);
			} else {
				return 0;
			}
		});
	});

	onDestroy(() => {
		grid.destroy();
	});
</script>

<main class="h-full w-full p-10 m-0">
	<h1 class="text-3xl mb-5">Decks</h1>
	<button class="btn mb-6">New Deck</button>
	<div class="dnd-container flex flex-col gap-3 relative" bind:this={listContainer}>
		{#each $seedsData.decks as deck}
			<SeedsCategory name={deck.name} dailyLimit={deck.dailyLimit} order={deck.order} />
		{/each}
	</div>
</main>
