<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { DeckData } from './+page';
	import { addNewItem, newItemBtnName } from '$lib/stores/helperStores';
	import PageHeader from '$components/app-layout/PageHeader.svelte';
	import { createSeed, expandedSeedId, seedsOrderByOptions } from './seedsLogic';
	import { seedsDecks, settings } from '$lib/stores/dbStores';
	import Seed from '$components/seeds/Seed.svelte';
	import SeedEditModal from '$components/seeds/SeedEditModal.svelte';
	import ModalBackground from '$components/common/ModalBackground.svelte';
	import { fillDocs } from '../decksLogic';

	export let data: DeckData;

	let deck: SeedsDeckType;
	let seeds: SeedType[];
	let showSeedCreator = false;

	// Get seeds array and deck from user data
	$: {
		let tempDeck: SeedsDeckType | undefined = undefined;
		let tempSeeds: SeedType[] = [];
		for (let i = 0; i < $seedsDecks.length; i++) {
			if ($seedsDecks[i].id === data.deckId) {
				tempDeck = $seedsDecks[i];
				tempSeeds = tempSeeds.concat($seedsDecks[i].seeds);
			}
		}
		if (tempDeck) {
			deck = tempDeck;
			seeds = tempSeeds;
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

	onDestroy(() => {
		// fillDocs()
	});
</script>

{#if showSeedCreator}
	<ModalBackground>
		<SeedEditModal
			seedCreator={true}
			seedData={null}
			{deck}
			hideModal={() => toggleShowSeedCreator(false)}
		/>
	</ModalBackground>
{/if}

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
	<Seed {seed} deckId={deck.id} />
{/each}
