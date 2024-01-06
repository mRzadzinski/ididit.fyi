<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';
	import { deleteSeed } from '../../lib/app-logic/seedsLogic';
	import SeedToggleShowEveryday from './SeedToggleShowEveryday.svelte';

	export let seed: SeedType;
	export let deck: DeckType;
	export let showSeedOptions: boolean;
	export let expandedMode: boolean;
	export let toggleShowSeedEditor: (show: boolean) => void;

	let toggleTooltip: HTMLElement;
	let showTooltip = false;

	function toggleTooltipVisibility(bool: boolean) {
		if (bool) {
			showTooltip = true;
		} else {
			showTooltip = false;
		}
	}
</script>

<!-- Stay centered if no author or source -->
<div
	class="relative flex items-center mr-[0.38rem]
{showSeedOptions ? '' : 'invisible'} 
{expandedMode && (seed.author || seed.source) ? 'self-end mb-[1.13rem]' : ''}"
	role="button"
	tabindex="0"
	on:click={(e) => e.stopImmediatePropagation()}
	on:keydown={(e) => e.stopImmediatePropagation()}
>
	<div
		class="absolute right-0 hidden justify-center items-center text-[0.7rem] text-base-300 h-10 w-[12.5rem] bg-gray-600 rounded-full transition-all duration-200
    {expandedMode ? 'bottom-6' : 'bottom-[1.90rem]'}
    {showTooltip && showSeedOptions ? 'opacity-100' : 'opacity-0'}"
		bind:this={toggleTooltip}
	>
		Show every day in Daily Review.
		<br>
		Exclude from deck's limit.
	</div>
	<SeedToggleShowEveryday
		{seed}
		{deck}
		{showSeedOptions}
		{toggleTooltip}
		{toggleTooltipVisibility}
	/>
	<div>
		<ThreeDotsDropdown
			itemId={seed.id}
			options={[
				{
					name: 'Edit',
					handler: () => toggleShowSeedEditor(true)
				},
				{
					name: 'Delete',
					handler: () => deleteSeed(seed.id, deck.id)
				}
			]}
		/>
	</div>
</div>

<style>
	[role='button'] {
		cursor: default;
	}
</style>
