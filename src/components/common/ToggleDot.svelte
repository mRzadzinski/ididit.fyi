<script lang="ts">
	export let seed: SeedType;
	export let showSeedOptions = false;
</script>

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
