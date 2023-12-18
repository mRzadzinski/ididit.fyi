<script lang="ts">
	import { onMount } from 'svelte';

	export let seed: SeedType;
	export let expandedMode: boolean;
	export let getSeedContentHtml: (seedContentHtml: HTMLElement) => void;

	let seedContentHtml: HTMLElement;

	onMount(() => {
		getSeedContentHtml(seedContentHtml);
	});
</script>

<!-- Constrain content to one line if not in expandedMode -->
<div
	class="mr-6 w-full {expandedMode ? 'pt-[1.19rem] pb-[1.06rem]' : 'line-clamp-1'}"
	bind:this={seedContentHtml}
>
	<span class="text-sm w-full">{seed.content}</span>
	<div class="text-xs opacity-60">
		{#if seed.author && expandedMode}
			<br />
			{seed.author}
		{/if}
		{#if seed.source && expandedMode}
			<br />
			<span class="italic">{seed.source}</span>
		{/if}
	</div>
</div>
