<script lang="ts">
	import { onMount } from 'svelte';
	import type { DeckId } from './+page';
	import { addNewItem, newItemBtnName } from '$lib/stores/helperStores';
	import PageHeader from '$components/app-layout/PageHeader.svelte';

	export let data: DeckId;

	onMount(() => {
		addNewItem.set(() => {});
		newItemBtnName.set('Seed');
	});
</script>

<!-- <PageHeader pageName='Seeds' /> -->

<h1>{data.deckId}</h1>
