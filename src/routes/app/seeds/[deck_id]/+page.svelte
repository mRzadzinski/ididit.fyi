<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { DeckData } from './+page';
	import { addNewItem, newItemBtnName } from '$lib/stores/helperStores';
	import PageHeader from '$components/app-layout/PageHeader.svelte';
	import {
		expandedSeedId,
		reorderSeeds,
		seedsOrderByOptions
	} from '../../../../lib/app-logic/seedsLogic';
	import { seedsData, settings } from '$lib/stores/dbStores';
	import Seed from '$components/seeds/Seed.svelte';
	import SeedEditModal from '$components/seeds/SeedEditModal.svelte';
	import { flip } from 'svelte/animate';

	export let data: DeckData;

	let deck: DeckType;
	let seeds: SeedType[];
	let showSeedCreator = false;

	// Get seeds and deck from user data
	$: {
		for (let i = 0; i < $seedsData.decks.length; i++) {
			if ($seedsData.decks[i].id === data.deckId) {
				deck = $seedsData.decks[i];
				seeds = deck.seeds;
			}
		}
	}

	// Reorder seeds on settings change
	$: {
		$settings.seedsOrderBy;
		seeds = reorderSeeds(seeds);
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
		newItemBtnName.set('');
	});
</script>

{#if showSeedCreator}
	<SeedEditModal
		seedCreator={true}
		seed={null}
		{deck}
		hideModal={() => toggleShowSeedCreator(false)}
	/>
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
	<div animate:flip={{ duration: 400 }}>
		<Seed {seed} {deck} />
	</div>
{/each}
