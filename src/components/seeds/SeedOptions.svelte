<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';
	import { deleteSeed } from '../../routes/app/seeds/[deck_id]/seedsLogic';
	import SeedToggleShowEveryday from './SeedToggleShowEveryday.svelte';

	export let seed: SeedType;
	export let deck: SeedsDeckType;
	export let showSeedOptions: boolean;
	export let expandedMode: boolean;
    export let toggleShowSeedEditor:(show: boolean) => void

	let toggleTooltip: HTMLElement;
	let showTooltip = false;
</script>

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
	<SeedToggleShowEveryday {seed} {deck} {showSeedOptions} {showTooltip} {toggleTooltip} />
	<div class="scale-[85%]">
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
