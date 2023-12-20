<script lang="ts">
	export let seed: SeedType;
</script>

<div class="text-xl w-full">{seed.content}</div>
<div class="text-base opacity-60">
	{#if seed.author}
		<br />
		<span>{seed.author}</span>
	{/if}
	{#if seed.source}
		<br />
		<span class="italic">{seed.source}</span>
	{/if}
</div>
