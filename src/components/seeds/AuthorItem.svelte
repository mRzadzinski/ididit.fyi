<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';

	export let author: string;
	export let container: HTMLElement;

	let showOptions = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="flex justify-between items-center w-full min-h-[1.875rem] custom-transition bg-white hover:bg-[var(--main)]"
	on:mouseenter={() => (showOptions = true)}
	on:mouseleave={() => (showOptions = false)}
>
	<span>{author}</span>
	<div class={showOptions ? '' : 'invisible'}>
		<ThreeDotsDropdown
			{container}
			scale={0.85}
			itemId="author-item"
			options={[
				{
					name: 'Edit',
					handler: () => {}
				},
				{
					name: 'Delete',
					handler: () => {}
				}
			]}
		/>
	</div>
</div>

<style>
	.custom-transition {
		transition: background-color 75ms ease-in;
	}
</style>
