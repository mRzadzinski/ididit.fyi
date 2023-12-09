<script lang="ts">
	import { onMount } from 'svelte';
	import type { DeckData } from './+page';
	import { addNewItem, newItemBtnName } from '$lib/stores/helperStores';
	import PageHeader from '$components/app-layout/PageHeader.svelte';
	import { createSeed, expandedSeedId, seedsOrderByOptions } from './seedsLogic';
	import { seedsDecks, settings } from '$lib/stores/dbStores';
	import Seed from '$components/seeds/Seed.svelte';
	import SeedEditModal from '$components/seeds/SeedEditModal.svelte';
	import ModalBackground from '$components/common/ModalBackground.svelte';

	export let data: DeckData;

	let seeds: SeedType[];
	let showSeedCreator = false;

	// Get seeds array from user data
	$: for (let i = 0; i < $seedsDecks.length; i++) {
		if ($seedsDecks[i].id === data.deckId) {
			seeds = $seedsDecks[i].seeds;
		}
	}

	function toggleShowSeedCreator(show: boolean) {
		if (show) {
			showSeedCreator = true;
		} else {
			showSeedCreator = false;
		}
	}

	onMount(() => {
		addNewItem.set(() => toggleShowSeedCreator(true));
		newItemBtnName.set('Seed');
		expandedSeedId.set('');
	});
</script>

<!-- {#if showSeedCreator}
{/if} -->
<ModalBackground>
	<SeedEditModal
		seedCreator={true}
		seedData={null}
		deckId={data.deckId}
		hideModal={() => toggleShowSeedCreator(false)}
	/>
</ModalBackground>

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
