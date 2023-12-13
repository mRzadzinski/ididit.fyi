<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { deleteSeed, expandedSeedId } from '../../routes/app/seeds/[deck_id]/seedsLogic';
	import ToggleDot from '$components/common/ToggleDot.svelte';

	export let seed: SeedType;
	export let deckId: string;

	let seedHtml: HTMLElement;
	let seedContentHtml: HTMLElement;
	let toggleTooltip: HTMLElement;
	let tooltipTimeout: NodeJS.Timeout;
	let otherSeedInExpandedMode: boolean;
	let initialHeight: number;
	let fullHeight: number;
	let showSeedOptions = false;
	let expandedMode = false;
	let showTooltip = false;
	let seedHover = false;

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

			// Hide overflow only for duration of expand animation, otherwise options dropdown is clipped
			setTimeout(() => {
				seedHtml.classList.add('overflow-visible');
			}, 300);
		}
		// Don't allow seed to collapse when text is highlighted
		else if (expandedMode && selection !== undefined && selection === 0) {
			expandedMode = false;
			expandedSeedId.set('');
			// Prevent options from disappearing when expanded mode was disabled while mouse is inside element
			if (!seedHover) {
				showSeedOptions = false;
			}
		}
	}

	// Collapse element when clicked outside
	function handleClickOutsideSeed(e: Event) {
		if (expandedMode && !seedHtml.contains(e.target as Node)) {
			handleSeedClick();
		}
	}

	function setFullHeight() {
		fullHeight = seedContentHtml.scrollHeight;
		seedHtml.style.height = fullHeight.toString() + 'px';
	}

	onMount(() => {
		initialHeight = seedHtml.scrollHeight;
	});

	afterUpdate(() => {
		// Manage seed height to handle animation
		if (expandedMode) {
			// When setting height synchronously it sometimes isn't calculated properly
			setTimeout(() => {
				setFullHeight();
			}, 0);
		} else {
			seedHtml.style.height = initialHeight.toString() + 'px';
		}
	});

	onDestroy(() => {
		expandedSeedId.set('');
	});
</script>

<svelte:window on:click={(e) => handleClickOutsideSeed(e)} />
<div
	class="flex justify-between items-center min-w-[496px] w-[100%] pl-5 mb-1 h-8 rounded-3xl bg-[#FEF6DE] custom-transition
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
		class="text-xs mr-8 w-full {expandedMode ? 'py-4' : 'line-clamp-1'}"
		bind:this={seedContentHtml}
	>
		<span class="text-sm w-full">{seed.content}</span>
		<div class="author-source-font-size italic opacity-60">
			{#if seed.author && expandedMode}
				<br />
				{seed.author}
			{/if}
			{#if seed.source && expandedMode}
				<br />
				{seed.source}
			{/if}
		</div>
	</div>
	<!-- Stay centered if no author or source -->
	<div
		class="relative flex items-center gap-[0.1rem] cursor-default
		{showSeedOptions ? '' : 'invisible'} 
		{expandedMode && (seed.author || seed.source) ? 'self-end mb-[0.3rem]' : ''}"
		role="button"
		tabindex="0"
		on:click={(e) => e.stopImmediatePropagation()}
		on:keydown={(e) => e.stopImmediatePropagation()}
	>
		<div
			class="absolute right-0 hidden justify-center items-center text-[0.7rem] text-base-300 h-6 w-60 bg-gray-600 rounded-full cursor-default transition-all duration-200
			{expandedMode ? 'bottom-6' : 'bottom-[1.90rem]'}
			{showTooltip && showSeedOptions ? 'opacity-100' : 'opacity-0'}"
			bind:this={toggleTooltip}
		>
			Toggle: show every day in Daily Review
		</div>
		<div
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
		>
			<ToggleDot enabled={seed.showEveryday} bright={showSeedOptions} clickHandler={() => {}} />
		</div>
		<div class="scale-[85%]">
			<ThreeDotsDropdown
				itemId={seed.id}
				options={[
					{
						name: 'Edit',
						handlers: [() => {}]
					},
					{
						name: 'Delete',
						handlers: [() => deleteSeed(seed.id, deckId)]
					}
				]}
			/>
		</div>
	</div>
</div>

<style>
	.custom-transition {
		transition: all 250ms ease-out;
	}

	.author-source-font-size {
		font-size: 0.73rem;
		line-height: 0.95rem;
	}
</style>
