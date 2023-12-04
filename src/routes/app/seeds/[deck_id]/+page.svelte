<script lang="ts">
	import { onMount } from 'svelte';
	import type { DeckData } from './+page';
	import { addNewItem, newItemBtnName } from '$lib/stores/helperStores';
	import PageHeader from '$components/app-layout/PageHeader.svelte';
	import { seedsOrderByOptions } from './seedsLogic';
	import { seedsDecks, settings, userDocs } from '$lib/stores/dbStores';
	import Seed from '$components/seeds/Seed.svelte';

	export let data: DeckData;
	let seeds: Seed[];

	// Get seeds array from user data
	$: for (let i = 0; i < $seedsDecks.length; i++) {
		if ($seedsDecks[i].id === data.deckId) {
			seeds = $seedsDecks[i].seeds;
		}
	}



	onMount(() => {
		addNewItem.set(() => {});
		newItemBtnName.set('Seed');
	});
</script>

<PageHeader
	pageName="Seeds"
	orderBy={$settings.seedsOrderBy}
	orderByOptions={seedsOrderByOptions}
	whereToUpdateOrder="seeds"
	breadcrumbs={true}
>
	<li><a href="/app/seeds">Decks</a></li>
	<li>{data.deckName}</li>
</PageHeader>

{#each seeds as seed (seed.id)}
 <Seed {seed} />
{/each}
