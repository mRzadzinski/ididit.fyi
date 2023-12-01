<script lang="ts">
	import { onMount } from 'svelte';
	import type { DeckId } from './+page';
	import { addNewItem, newItemBtnName } from '$lib/stores/helperStores';
	import PageHeader from '$components/app-layout/PageHeader.svelte';
	import { seedsOrderByOptions } from './seedsLogic';
	import { settings } from '$lib/stores/dbStores';

	export let data: DeckId;

	onMount(() => {
		addNewItem.set(() => {});
		newItemBtnName.set('Seed');
	});
</script>

<PageHeader
	pageName="Seeds"
	orderBy={$settings.seedsOrderBy}
	orderByOptions={seedsOrderByOptions}
	orderBySettingsProp="seedsOrderBy"
/>
<h1>{data.deckId}</h1>
