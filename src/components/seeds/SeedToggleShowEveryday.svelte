<script lang="ts">
	import ToggleDot from '$components/common/ToggleDot.svelte';
	import { editSeed } from '../../lib/app-logic/seedsLogic';

	export let seed: SeedType;
	export let deck: DeckType;
	export let showSeedOptions: boolean;
	export let toggleTooltip: HTMLElement;
	export let toggleTooltipVisibility: (bool: boolean) => void;

	let tooltipTimeout: NodeJS.Timeout;
</script>

<div
	role="button"
	tabindex="0"
	on:mouseenter={() => {
		tooltipTimeout = setTimeout(() => {
			// Invisible tooltip interferes with seed click handler, so it needs to be display:none before transitioning opacity
			toggleTooltip.style.display = 'flex';
			toggleTooltipVisibility(true);
		}, 900);
	}}
	on:mouseleave={() => {
		clearTimeout(tooltipTimeout);
		toggleTooltipVisibility(false);
		toggleTooltip.style.display = 'none';
	}}
>
	<ToggleDot
		enabled={seed.showEveryday}
		bright={showSeedOptions}
		clickHandler={() => {
			const updatedSeed = { ...seed, showEveryday: !seed.showEveryday };
			editSeed(updatedSeed, deck.id);
		}}
	/>
</div>
