<script lang="ts">
	import ButtonClose from '../common/ButtonClose.svelte';
	import ReviewModal from './ReviewModal.svelte';
	import ButtonArrowLeft from '../common/ButtonArrowLeft.svelte';
	import ReviewContentSeed from './ReviewContent.svelte';
	import ReviewInstructions from './ReviewInstructions.svelte';
	import { reviewNext, setReviewDoneStatus } from '$lib/app-logic/reviewLogic';
	import { dailyReview } from '$lib/stores/dbStores';

	export let closeReview: () => void;

	let content: SeedType;

	$: {
		if ($dailyReview && $dailyReview.decks.length > 0) {
			content = $dailyReview.decks[0].seeds[0];
		}
	}

	async function next() {
		await reviewNext();

		// Review finished
		if ($dailyReview?.decks.length === 0) {
			await setReviewDoneStatus(true);
			closeReview();
		}
	}
</script>

<ReviewModal>
	<div class="flex flex-col max-w-screen-xl w-full h-full">
		<!-- Upper part -->
		<progress class="progress w-full" value="70" max="100" />
		<div class="self-end mr-4 mt-4">
			<ButtonClose handler={closeReview} />
		</div>
		<!-- Content -->
		<div class="grow flex justify-between items-center">
			<div class="px-16">
				<ReviewContentSeed type={'seed'} data={content} />
			</div>
			<!-- Rotate 180 deg to get arrow right -->
			<div class="mr-4 rotate-180">
				<ButtonArrowLeft handler={next} />
			</div>
		</div>
		<ReviewInstructions />
	</div>
</ReviewModal>
