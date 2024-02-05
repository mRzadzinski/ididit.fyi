<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';

	export let author: string;
	export let container: HTMLElement;
</script>
<!-- Dropdown height 107px -->
<div class="flex justify-between items-center w-full min-h-[1.875rem] hover:bg-[var(--main)]">
	<span>{author}</span>
	<ThreeDotsDropdown
		{container}
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
