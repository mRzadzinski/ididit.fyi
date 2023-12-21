<script lang="ts">
	import ReviewContentSeed from './ReviewContentSeed.svelte';

	export let type: string;
	export let data: SeedType;
</script>

{#if type === 'seed'}
	<ReviewContentSeed {data} />
{/if}
