<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';

	export let name: string;
	export let container: HTMLElement;
	export let isButton = true;

	let showOptions = false;
	let editMode = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="flex justify-between items-center w-full min-h-[1.875rem] pl-[0.75rem] pr-1 custom-transition bg-white rounded-full hover:bg-[var(--main)]
	{isButton ? 'cursor-pointer' : 'cursor-default'}"
	on:mouseenter={() => (showOptions = true)}
	on:mouseleave={() => (showOptions = false)}
>
	<span class="text-sm">{name}</span>
	<div class={showOptions ? '' : 'invisible'}>
		<ThreeDotsDropdown
			{container}
			scale={0.85}
			itemId="author-item"
			options={[
				{
					name: 'Edit',
					handler: () => (editMode = true)
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
