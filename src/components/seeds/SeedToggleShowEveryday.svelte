<script lang="ts">
	import ToggleDot from '$components/common/ToggleDot.svelte';
	import { editSeed } from '../../routes/app/seeds/[deck_id]/seedsLogic';

	export let seed: SeedType;
	export let deck: SeedsDeckType;
	export let showSeedOptions: boolean;
	export let showTooltip: boolean;
	export let toggleTooltip: HTMLElement;

	let tooltipTimeout: NodeJS.Timeout;
</script>

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
	<ToggleDot
		enabled={seed.showEveryday}
		bright={showSeedOptions}
		clickHandler={() => {
			const updatedSeed = { ...seed, showEveryday: !seed.showEveryday };
			editSeed(updatedSeed, deck.id);
		}}
	/>
</div>
