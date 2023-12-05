<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';
	import { afterUpdate } from 'svelte';

	export let seed: SeedType;
	export let expandedSeedId: string;
	export let manageExpandedSeedId: (action: string, id: string) => void;

	let seedHtml: HTMLElement;
	let seedContentHtml: HTMLElement;
	let showSeedOptions = false;
	let expandedMode = false;
	let otherSeedInExpandedMode: boolean;

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
		} else {
			otherSeedInExpandedMode = false;
		}
	});
</script>

<div
	class="flex justify-between items-center min-w-[496px] w-[100%] pl-8 mb-1 rounded-3xl bg-[#FEF6DE] overflow-hidden
	{otherSeedInExpandedMode ? '' : 'hover:bg-[#FFCD4C]'}
	{expandedMode ? 'bg-[#FFCD4C] pr-1 cursor-default' : 'h-8 cursor-pointer'}"
	role="button"
	tabindex="0"
	bind:this={seedHtml}
	on:mouseenter={() => (showSeedOptions = true)}
	on:mouseleave={() => (showSeedOptions = false)}
	on:click={() => {
		expandedMode = true;
		manageExpandedSeedId('enable', seed.id);
	}}
	on:keydown={() => {
		expandedMode = true;
		manageExpandedSeedId('enable', seed.id);
	}}
>
	<div class="text-xs mr-8 {expandedMode ? 'my-4' : 'line-clamp-1'}" bind:this={seedContentHtml}>
		<span class="text-[0.78rem]">{seed.content}</span>
		<br /><br />

		<div class="custom-font-size italic opacity-60">
			{seed.author}
			<br />
			{seed.source}
		</div>
	</div>
	<div
		class="scale-[85%] {showSeedOptions ? '' : 'invisible'} {expandedMode
			? 'self-end mb-[0.3rem]'
			: ''}"
	>
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

<style>
	.height-transition {
		transition: height 300ms ease-out;
	}

	.color-transition {
		transition: background-color 75ms ease-in;
	}

	.custom-font-size {
		font-size: 0.73rem;
		line-height: 0.95rem;
	}
</style>
