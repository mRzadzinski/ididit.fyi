<script lang="ts">
	export let data: SeedType;
</script>

<div class="text-xl w-full">{data.content}</div>
<div class="text-base opacity-60">
	{#if data.author}
		<br />
		<span>{data.author}</span>
	{/if}
	{#if data.source}
		<br />
		<span class="italic">{data.source}</span>
	{/if}
</div>