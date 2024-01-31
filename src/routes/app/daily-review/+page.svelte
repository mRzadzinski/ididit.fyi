<script lang="ts">
	import ReviewInterface from '$components/daily-review/ReviewInterface.svelte';
	import { refreshReview } from '$lib/app-logic/daily-review/refreshReviewLogic';
	import { getReview } from '$lib/app-logic/daily-review/reviewLogic';
	import { dailyReview, settings } from '$lib/stores/dbStores';

	let nothingToReview = true;
	let showReview = false;

	// Check if daily review is empty
	$: if ($dailyReview && !$settings.dailyReviewInfo.done) {
		nothingToReview = true;
		for (let i = 0; i < $dailyReview.decks.length; i++) {
			if ($dailyReview.decks[i].seeds.length > 0) {
				nothingToReview = false;
				break;
			}
		}
	} else if ($settings.dailyReviewInfo.done) {
		nothingToReview = false;
	}

	// Check if review reset date passed
	// Put guard (!showReview) to get new review when user finished previous one just after reset date
	$: if (!showReview && $settings.dailyReviewInfo.nextReset.toMillis() - Date.now() <= 0) {
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
	<div class="flex justify-center items-center mt-[20vh]">
		{#if nothingToReview}
			<div class="text-center text-xl">There is nothing to review.</div>
		{:else if !$settings.dailyReviewInfo.done}
			<button class="btn btn-lg w-48 bg-[var(--main)]" on:click={() => (showReview = true)}>
				START
			</button>
		{:else if $settings.dailyReviewInfo.done}
			<div class="flex flex-col justify-center gap-4">
				<div class="text-center text-xl">
					Review is done.
					<br />
					See you tomorrow!
				</div>
				<button
					class="btn btn-sm opacity-40 hover:opacity-100 hover:bg-[var(--main)]"
					on:click={getReview}>Review more</button
				>
			</div>
		{/if}
	</div>
</div>
