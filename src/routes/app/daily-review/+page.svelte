<script lang="ts">
	import ReviewInterface from '$components/daily-review/ReviewInterface.svelte';

	let started = false;
</script>

{#if started}
	<ReviewInterface />
{/if}

<div class="flex flex-col h-full">
	<div class="flex justify-between">
		<h1 class="text-3xl mb-3">Daily Review</h1>
		<button class="btn btn-sm text-xs">Options</button>
	</div>
	<div class="flex justify-center items-center mt-[20%]">
		<button class="btn btn-lg w-48 bg-[#FFCD4C]" on:click={() => (started = true)}>START</button>
	</div>
</div>
