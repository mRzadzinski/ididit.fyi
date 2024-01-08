<script lang="ts">
	import ReviewInterface from '$components/daily-review/ReviewInterface.svelte';
	import { getReview, refreshReview } from '$lib/app-logic/reviewLogic';
	import { seedsData, settings } from '$lib/stores/dbStores';

	let appIsEmpty = true;
	let showReview = false;

	// Check if there is anything to review
	for (let i = 0; i < $seedsData.decks.length; i++) {
		if ($seedsData.decks[i].seeds.length > 0) {
			appIsEmpty = false;
		}
	}

	// Check if review reset date passed
	if ($settings.dailyReviewInfo.nextReset.toMillis() - Date.now() <= 0) {
		getReview();
	} else {
		refreshReview();
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
		<h1 class="text-4xl mb-3">Daily Review</h1>
		<!-- <button class="btn btn-sm text-xs">Options</button> -->
	</div>
	<div class="flex justify-center items-center mt-[20%]">
		{#if appIsEmpty}
			<div class="text-center text-xl">There is nothing to review.</div>
		{:else if !$settings.dailyReviewInfo.done}
			<button class="btn btn-lg w-48 bg-[#FFCD4C]" on:click={() => (showReview = true)}>
				START
			</button>
		{:else}
			<div class="flex flex-col justify-center gap-4">
				<div class="text-center text-xl">
					Review is done.
					<br />
					See you tomorrow!
				</div>
				<button class="btn btn-sm opacity-40" on:click={getReview}>Review more</button>
			</div>
		{/if}
	</div>
</div>
