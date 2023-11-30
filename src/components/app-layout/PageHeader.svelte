<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { changeDeckSortMethod } from '../../routes/app/seeds/decksLogic';

	export let pageName: string;
	export let orderBy: string;
	export let orderByOptions: string[];
	let selectOrderInput: HTMLSelectElement;

	afterUpdate(() => {
		selectOrderInput.value = orderBy;
	});
</script>

<div class="flex justify-between mb-10">
	<div class="flex items-end gap-4">
		<h1 class="text-3xl">{pageName}</h1>
		<slot />
	</div>
	<div class="flex items-end">
		<div class="flex items-center">
			<span class="text-xs mr-2">Order by:</span>
			<select
				class="select select-bordered select-xs max-w-xs self-end pl-3 pr-6 bg-white"
				bind:this={selectOrderInput}
				on:input={() => changeDeckSortMethod(selectOrderInput.value)}
			>
				{#each orderByOptions as option}
					<option>{option}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<style>
	.select {
		/* Arrow position */
		background-position: calc(100% - 13px) calc(1px + 50%), calc(100% - 9px) calc(1px + 50%);
	}
</style>
