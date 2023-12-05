<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';

	export let seed: SeedType;

	let showDeckOptions = false;

	function toggleDeckOptionsVisibility(bool: boolean) {
		// Timeout to sync with highlight animation
		if (bool) {
			setTimeout(() => {
				showDeckOptions = true;
			}, 75);
		} else {
			setTimeout(() => {
				showDeckOptions = false;
			}, 75);
		}
	}
</script>

<div
	class="flex justify-between items-center min-w-[496px] w-[100%] h-10 pl-8 pr-1 rounded-3xl transition duration-75 bg-[#FEF6DE] hover:bg-[#FFCD4C]"
	role="listitem"
	on:mouseenter={() => {
		toggleDeckOptionsVisibility(true);
	}}
	on:mouseleave={() => toggleDeckOptionsVisibility(false)}
>
	<div class="text-sm line-clamp-1 mr-8">
		{seed.content}
	</div>
	<div class={showDeckOptions ? '' : 'invisible'}>
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
