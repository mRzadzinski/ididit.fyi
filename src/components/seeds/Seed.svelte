<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { expandedSeedId } from '../../routes/app/seeds/[deck_id]/seedsLogic';

	export let seed: SeedType;

	let seedHtml: HTMLElement;
	let seedContentHtml: HTMLElement;
	let showSeedOptions = false;
	let expandedMode = false;
	let otherSeedInExpandedMode: boolean;
	let initialHeight: number;
	let fullHeight: number;

	// Save which seed is in expandedMode
	$: if ($expandedSeedId.length > 0 && $expandedSeedId !== seed.id) {
		otherSeedInExpandedMode = true;
		expandedMode = false;
	} else {
		otherSeedInExpandedMode = false;
	}

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

	onMount(() => {
		initialHeight = seedHtml.scrollHeight;
	});

	afterUpdate(() => {
		// Manage seed height to handle animation
		if (expandedMode) {
			// Get height of hidden content
			fullHeight = seedContentHtml.scrollHeight;

			// Add margins to it
			let newHeight = fullHeight;
			newHeight += parseInt(
				window.getComputedStyle(seedContentHtml).getPropertyValue('margin-top')
			);
			newHeight += parseInt(
				window.getComputedStyle(seedContentHtml).getPropertyValue('margin-bottom')
			);
			// Update
			seedHtml.style.height = newHeight.toString() + 'px';
		} else {
			seedHtml.style.height = initialHeight.toString() + 'px';
		}
	});

	onDestroy(() => {
		expandedSeedId.set('');
	});
</script>

<div
	class="flex justify-between items-center min-w-[496px] w-[100%] pl-8 mb-1 rounded-3xl bg-[#FEF6DE] overflow-hidden height-transition
	{otherSeedInExpandedMode ? '' : 'hover:bg-[#FFCD4C]'}
	{expandedMode ? `bg-[#FFCD4C] pr-1 cursor-default` : 'cursor-pointer'}"
	role="button"
	tabindex="0"
	bind:this={seedHtml}
	on:mouseenter={() => (showSeedOptions = true)}
	on:mouseleave={() => (showSeedOptions = false)}
	on:click={() => {
		const selection = window.getSelection()?.toString().length;

		if (!expandedMode) {
			expandedMode = true;
			expandedSeedId.set(seed.id);
		} else if (expandedMode && selection !== undefined && selection === 0) {
			expandedMode = false;
			expandedSeedId.set('');
		}
	}}
	on:keydown={() => {
		if (!expandedMode) {
			expandedMode = true;
			expandedSeedId.set(seed.id);
		} else {
			expandedMode = false;
			expandedSeedId.set('');
		}
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
		class="flex {showSeedOptions ? '' : 'invisible'} {expandedMode ? 'self-end mb-[0.3rem]' : ''}"
		role="button"
		tabindex="0"
		on:click={(e) => e.stopImmediatePropagation()}
		on:keydown={(e) => e.stopImmediatePropagation()}
	>
		<!-- class:unchecked={!seed.showEveryday} -->
		<input
			class="radio scale-[0.6] mt-[0.13rem] -mr-[0.2rem] checked:shadow-black"
			type="radio"
			name="radio-{seed.id}"
		/>
		<div class="scale-[85%]">
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
</div>

<style>
	.unchecked {
		transform: scale(0.7);
		border: white 2px solid;
	}

	.height-transition {
		transition: all 250ms ease-out;
	}

	.color-transition {
		transition: background-color 75ms ease-in;
	}

	.custom-font-size {
		font-size: 0.73rem;
		line-height: 0.95rem;
	}
</style>
