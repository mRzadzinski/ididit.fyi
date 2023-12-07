<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { expandedSeedId } from '../../routes/app/seeds/[deck_id]/seedsLogic';

	export let seed: SeedType;

	let seedHtml: HTMLElement;
	let seedContentHtml: HTMLElement;
	let showEverydayToggleContainer: HTMLElement;
	let dotsDropdown: HTMLElement;
	let seedOptionsContainer: HTMLElement;
	let toggleTooltip: HTMLElement;
	let showSeedOptions = false;
	let expandedMode = false;
	let showTooltip = false;
	let seedHover = false;
	let tooltipTimeout: NodeJS.Timeout;
	let otherSeedInExpandedMode: boolean;
	let initialHeight: number;
	let fullHeight: number;

	// Save which seed is in expandedMode
	$: if ($expandedSeedId.length > 0 && $expandedSeedId !== seed.id) {
		otherSeedInExpandedMode = true;
		expandedMode = false;

		// If expanded mode was disabled while mouse is inside element, options would disappear
		if (!seedHover) {
			showSeedOptions = false;
		}
	} else {
		otherSeedInExpandedMode = false;
	}

	function handleSeedClick() {
		const selection = window.getSelection()?.toString().length;

		if (!expandedMode) {
			expandedMode = true;
			showSeedOptions = true;
			expandedSeedId.set(seed.id);
		}
		// Don't allow seed to collapse when text is highlighted
		else if (expandedMode && selection !== undefined && selection === 0) {
			expandedMode = false;
			// If expanded mode was disabled while mouse is inside element, options would disappear
			if (!seedHover) {
				showSeedOptions = false;
			}
			expandedSeedId.set('');
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
	class="flex justify-between items-center min-w-[496px] w-[100%] pl-8 mb-1 h-8 rounded-3xl bg-[#FEF6DE] custom-transition
	{otherSeedInExpandedMode ? '' : 'hover:bg-[#FFCD4C]'}
	{expandedMode ? `bg-[#FFCD4C] pr-1 cursor-default overflow-hidden` : 'cursor-pointer'}"
	role="button"
	tabindex="0"
	bind:this={seedHtml}
	on:mouseenter={() => {
		seedHover = true;
		if (!otherSeedInExpandedMode) {
			showSeedOptions = true;
		}
	}}
	on:mouseleave={() => {
		seedHover = false;
		if (!expandedMode) {
			showSeedOptions = false;
		}
	}}
	on:click={() => {
		handleSeedClick();
	}}
	on:keydown={() => {
		handleSeedClick();
	}}
>
	<!-- Constrain content to one line if not in expandedMode -->
	<div
		class="text-xs mr-8 w-full {expandedMode ? 'my-4' : 'line-clamp-1'}"
		bind:this={seedContentHtml}
	>
		<span class="text-[0.78rem] w-full">{seed.content}</span>
		<div class="author-source-font-size italic opacity-60">
			{#if seed.author && expandedMode}
				<br />
				{seed.author}
			{/if}
			{#if seed.source}
				<br />
				{seed.source && expandedMode}
			{/if}
		</div>
	</div>
	<!-- Stay centered if not author or source -->
	<div
		class="relative flex items-center gap-[0.1rem] cursor-default
		{showSeedOptions ? '' : 'invisible'} 
		{expandedMode && (seed.author || seed.source) ? 'self-end mb-[0.3rem]' : ''}"
		role="button"
		tabindex="0"
		on:click={(e) => e.stopImmediatePropagation()}
		on:keydown={(e) => e.stopImmediatePropagation()}
		bind:this={seedOptionsContainer}
	>
		<div
			class="absolute right-[2.85rem] hidden justify-center items-center text-[0.7rem] text-base-content h-6 w-56 bg-base-100 rounded-lg cursor-default transition-all duration-300
			{showTooltip && showSeedOptions ? 'opacity-100' : 'opacity-0'}"
			bind:this={toggleTooltip}
		>
			Toggle: show every day in Daily Review
		</div>
		<div
			class="w-3 h-3 rounded-full {seed.showEveryday ? 'visible' : ''}"
			class:unchecked={!seed.showEveryday}
			class:checked-no-options={seed.showEveryday && !showSeedOptions}
			class:checked-with-options={seed.showEveryday && showSeedOptions}
			role="button"
			tabindex="0"
			on:mouseenter={() => {
				tooltipTimeout = setTimeout(() => {
					// Invisible tooltip interferes with seed click handler, so it needs to be display:none before transitioning opacity
					toggleTooltip.style.display = 'flex';
					showTooltip = true;
				}, 900);
			}}
			on:mouseleave={() => {
				clearTimeout(tooltipTimeout);
				showTooltip = false;
				toggleTooltip.style.display = 'none';
			}}
			bind:this={showEverydayToggleContainer}
		/>
		<div class="scale-[85%]" bind:this={dotsDropdown}>
			<ThreeDotsDropdown
				itemId={seed.id}
				options={[
					{
						name: 'Edit',
						handlers: [() => {}]
					},
					{
						name: 'Delete',
						handlers: [() => {}]
					}
				]}
			/>
		</div>
	</div>
</div>

<style>
	.unchecked {
		width: 0.82rem;
		height: 0.82rem;
		border: solid 2px white;
		background-color: none;
	}

	.checked-with-options {
		background-color: white;
	}

	.checked-no-options {
		background-color: #ffcd4c;
	}

	.custom-transition {
		transition: all 250ms ease-out;
	}

	.author-source-font-size {
		font-size: 0.73rem;
		line-height: 0.95rem;
	}
</style>
