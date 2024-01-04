<script lang="ts">
	import ButtonClose from '../common/ButtonClose.svelte';
	import ReviewModal from './ReviewModal.svelte';
	import ButtonArrowLeft from '../common/ButtonArrowLeft.svelte';
	import ReviewContentSeed from './ReviewContent.svelte';
	import ReviewInstructions from './ReviewInstructions.svelte';
	import {
		updateCurrentReview,
		type CurrentReview,
		setReviewDoneStatus
	} from '$lib/app-logic/reviewLogic';
	import { dailyReview } from '$lib/stores/dbStores';

	export let closeReview: () => void;

	let current: CurrentReview;
	let content: SeedType;

	$: {
		if ($dailyReview) {
			current = $dailyReview.current;

			if (current?.type === 'seed') {
				content = $dailyReview.decks[current.deckIndex].seeds[current.seedIndex];
			}
		}
	}

	function next() {
		if (current?.type === 'seed' && $dailyReview) {
			const decks = $dailyReview.decks;
			const deck = decks[current.deckIndex];

			// Next seed
			if (current.seedIndex + 1 < deck.seeds.length) {
				updateCurrentReview({ ...current, seedIndex: current.seedIndex + 1 });
			}
			// Go to first seed of next deck
			else if (current.deckIndex + 1 < decks.length) {
				updateCurrentReview({ ...current, deckIndex: current.deckIndex + 1, seedIndex: 0 });
			}
			// Review finished
			else {
				setReviewDoneStatus(true);
				closeReview();
			}
		}
	}

	function prev() {
		if (current?.type === 'seed' && $dailyReview) {
			const decks = $dailyReview.decks;

			// Prev seed
			if (current.seedIndex - 1 >= 0) {
				updateCurrentReview({ ...current, seedIndex: current.seedIndex - 1 });
			}
			// Go to last seed of prev deck
			else if (current.deckIndex - 1 >= 0) {
				updateCurrentReview({
					...current,
					deckIndex: current.deckIndex - 1,
					seedIndex: decks[current.deckIndex - 1].seeds.length - 1
				});
			}
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
			<div class="ml-4">
				<ButtonArrowLeft handler={prev} />
			</div>
			<div class="px-16">
				<ReviewContentSeed type={current.type} data={content} />
			</div>
			<!-- Rotate 180 deg to get arrow right -->
			<div class="mr-4 rotate-180">
				<ButtonArrowLeft handler={next} />
			</div>
		</div>
		<ReviewInstructions />
	</div>
</ReviewModal>
