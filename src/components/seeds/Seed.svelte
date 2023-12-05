<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';

	export let seed: SeedType;
	export let expandedSeedId: string;
	export let manageExpandedSeedId: (action: string, id: string) => void;

	let seedHtml: HTMLElement;
	let seedContentHtml: HTMLElement;
	let showSeedOptions = false;
	let expandedMode = false;
	let otherSeedInExpandedMode: boolean;
	let fullHeight: number;

	function toggleSeedOptionsVisibility(bool: boolean) {
		// Timeout to sync with highlight animation
		if (bool) {
			setTimeout(() => {
				showSeedOptions = true;
			}, 75);
		} else {
			setTimeout(() => {
				showSeedOptions = false;
			}, 75);
		}
	}

	afterUpdate(() => {
		if (expandedSeedId.length > 0 && expandedSeedId !== seed.id) {
			otherSeedInExpandedMode = true;
			expandedMode = false;
			// toggleSeedOptionsVisibility(false);
		} else {
			otherSeedInExpandedMode = false;
		}
	});

	// afterUpdate(() => {
	// 	fullHeight = seedContentHtml.scrollHeight;
	// });
</script>

<div
	class="flex justify-between items-center min-w-[496px] w-[100%] pl-8 mb-1 rounded-3xl list-el-transitions bg-[#FEF6DE] cursor-pointer
	{otherSeedInExpandedMode ? '' : 'hover:bg-[#FFCD4C]'}
	{expandedMode ? `overflow-hidden py-4 bg-[#FFCD4C] pr-1` : 'h-8'}"
	role="button"
	tabindex="0"
	bind:this={seedHtml}
	on:mouseenter={() => {
		toggleSeedOptionsVisibility(true);
	}}
	on:mouseleave={() => toggleSeedOptionsVisibility(false)}
	on:click={() => {
		expandedMode = true;
		manageExpandedSeedId('enable', seed.id);
	}}
	on:keydown={() => {
		expandedMode = true;
		manageExpandedSeedId('enable', seed.id);
	}}
>
	<p class="text-xs mr-8 {expandedMode ? '' : 'line-clamp-1'}" bind:this={seedContentHtml}>
		{seed.content}
		<br /><br />
		{seed.author}
		<br />
		{seed.source}
	</p>
	<div class='scale-[85%] {showSeedOptions ? '' : 'invisible'} {expandedMode? 'self-end -mb-[0.6rem]' : ''}'>
		<ThreeDotsDropdown
			itemId={seed.id}
			options={[
				// {
				// 	name: 'Edit',
				// 	handlers: [() => handleToggleEdit('enable')]
				// },
				// {
				// 	name: 'Delete',
				// 	handlers: [() => handleDeleteDeck(deck.id, dndItem)]
				// }
			]}
		/>
	</div>
</div>
