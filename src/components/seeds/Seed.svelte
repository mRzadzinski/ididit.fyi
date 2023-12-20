<script lang="ts">
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { expandedSeedId } from '../../lib/app-logic/seedsLogic';
	import SeedEditModal from './SeedEditModal.svelte';
	import SeedData from './SeedData.svelte';
	import SeedOptions from './SeedOptions.svelte';

	export let seed: SeedType;
	export let deck: SeedsDeckType;

	let seedHtml: HTMLElement;
	let seedContentHtml: HTMLElement;
	let heightTimeout: NodeJS.Timeout;
	let otherSeedInExpandedMode: boolean;
	let initialHeight: number;
	let fullHeight: number;
	let showSeedEditor = false;
	let showSeedOptions = false;
	let expandedMode = false;

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

	function getSeedContentHtml(htmlEl: HTMLElement) {
		seedContentHtml = htmlEl;
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
		if (seedContentHtml && seedHtml) {
			fullHeight = seedContentHtml.scrollHeight;
			seedHtml.style.height = fullHeight.toString() + 'px';
		}
	}

	function toggleShowSeedEditor(show: boolean) {
		if (show) {
			showSeedEditor = true;
		} else {
			showSeedEditor = false;
		}
	}

	onMount(() => {
		initialHeight = seedHtml.scrollHeight;
	});

	afterUpdate(() => {
		// Manage seed height to handle animation
		if (expandedMode) {
			// When setting height synchronously it sometimes isn't calculated properly
			heightTimeout = setTimeout(() => {
				setFullHeight();
			}, 0);
		} else {
			seedHtml.style.height = initialHeight.toString() + 'px';
		}
	});

	onDestroy(() => {
		clearTimeout(heightTimeout);
		expandedSeedId.set('');
	});
</script>

<svelte:window on:click={(e) => handleClickOutsideSeed(e)} />

{#if showSeedEditor}
	<SeedEditModal seedCreator={false} {seed} {deck} hideModal={() => toggleShowSeedEditor(false)} />
{/if}

<div
	class="flex justify-between items-center min-w-[496px] w-[100%] pl-[1.81rem] mb-[0.69rem] h-12 rounded-3xl bg-[#FEF6DE] custom-transition
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
	<SeedData {seed} {expandedMode} {getSeedContentHtml} />
	<SeedOptions {seed} {deck} {showSeedOptions} {expandedMode} {toggleShowSeedEditor} />
</div>

<style>
	.custom-transition {
		transition: all 250ms ease-out;
	}
</style>
