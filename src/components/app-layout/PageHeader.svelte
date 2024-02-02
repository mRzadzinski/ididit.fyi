<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { updateSortMethod } from '$lib/app-logic/commonLogic';
	import SearchBtn from '$components/app-layout/SearchBtn.svelte';
	import SearchInput from '$components/app-layout/SearchInput.svelte';
	import AuthorsSourcesModal from '$components/seeds/AuthorsSourcesModal.svelte';

	export let pageName: string;
	export let orderBy: string;
	export let orderByOptions: { name: string; value: string }[];
	export let whereToUpdateOrder: string;
	export let breadcrumbs = false;

	let selectOrderInput: HTMLSelectElement;
	let expandedSearch = false;
	let showOptions = true;

	afterUpdate(() => {
		selectOrderInput.value = orderBy;
	});
</script>

{#if showOptions}
	{#if pageName === 'Decks'}
		<AuthorsSourcesModal />
	{/if}
{/if}

<div class="flex justify-between mb-10">
	<div class="flex items-end gap-[1.13rem]">
		<h1 class="text-4xl">{pageName}</h1>
		{#if breadcrumbs}
			<div class="flex items-end text-xs breadcrumbs pt-0 pb-1">
				<ul>
					<!-- Provide breadcrumbs li items with links to go back -->
					<slot />
				</ul>
			</div>
		{/if}
	</div>
	<div class="flex items-end gap-[0.4rem]">
		{#if !expandedSearch}
			<SearchBtn clickHandler={() => (expandedSearch = true)} />
		{:else}
			<SearchInput collapseInput={() => (expandedSearch = false)} />
		{/if}
		{#if pageName === 'Decks'}
			<button class="btn btn-xs bg-white w-[65px]" on:click={() => (showOptions = true)}
				>Options</button
			>
		{/if}
		<div class="flex items-center">
			<select
				class="select select-bordered select-xs max-w-xs self-end pl-3 pr-6 mb-[0.2rem] bg-white"
				bind:this={selectOrderInput}
				on:input={() => updateSortMethod(whereToUpdateOrder, selectOrderInput.value)}
			>
				{#each orderByOptions as option}
					<option value={option.value}>{option.name}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<style>
	.select {
		/* Arrow position */
		background-position: calc(100% - 13px) calc(1px + 50%), calc(100% - 9px) calc(1px + 50%);
		height: 1.25rem;
		min-height: 1.25rem;
		line-height: 0.9rem;
	}

	.btn-xs {
		height: 1.25rem;
		min-height: 1.25rem;
		margin-bottom: 0.2rem;

		text-transform: none;
		font-weight: 400;
		border-color: var(--fallback-bc, oklch(var(--bc) / 0.2));
	}
</style>
