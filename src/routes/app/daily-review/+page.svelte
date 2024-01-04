<script lang="ts">
	import ReviewInterface from '$components/daily-review/ReviewInterface.svelte';
	import { getReview } from '$lib/app-logic/reviewLogic';
	import { settings } from '$lib/stores/dbStores';

	let showReview = false;

	// Check if review reset date passed
	if ($settings.dailyReviewInfo.nextReset.toMillis() - Date.now() <= 0) {
		getReview();
	}

	function toggleShowReview(bool: boolean) {
		if (bool) {
			showReview = true;
		} else {
			showReview = false;
		}
	}
</script>

{#if showReview}
	<ReviewInterface closeReview={() => toggleShowReview(false)} />
{/if}

<div class="flex flex-col h-full">
	<div class="flex justify-between">
		<h1 class="text-3xl mb-3">Daily Review</h1>
		<button class="btn btn-sm text-xs">Options</button>
	</div>
	<div class="flex justify-center items-center mt-[20%]">
		{#if !$settings.dailyReviewInfo.done}
			<button class="btn btn-lg w-48 bg-[#FFCD4C]" on:click={() => (showReview = true)}>
				START
			</button>
		{:else}
			<div class="text-center text-xl">
				Review is done.
				<br />
				See you tomorrow!
			</div>
		{/if}
	</div>
</div>
