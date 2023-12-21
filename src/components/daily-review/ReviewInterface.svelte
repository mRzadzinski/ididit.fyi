<script lang="ts">
	import ButtonClose from '../common/ButtonClose.svelte';
	import ReviewModal from './ReviewModal.svelte';
	import ButtonArrowLeft from '../common/ButtonArrowLeft.svelte';
	import ReviewContentSeed from './ReviewContentSeed.svelte';
	import ReviewInstructions from './ReviewInstructions.svelte';
	import type { CurrentReview, DailyReview } from '$lib/app-logic/reviewLogic';

	export let reviewData: DailyReview;
	export let closeReview: () => void;

	let current: CurrentReview;
	let content: SeedType;

	$: {
		current = reviewData.current;
		if (current?.type === 'seed') {
			content = reviewData.decks[current.deckIndex][current.seedIndex];
		}
	}

	function next() {
		if (current?.type === 'seed') {
			const decks = reviewData.decks;
			const deck = decks[current.deckIndex];

			// Next seed
			if (current.seedIndex + 1 < deck.length) {
				current.seedIndex++;
			}
			// Next deck
			else if (current.deckIndex + 1 < decks.length) {
				current.deckIndex++;
				// Go to first seed of next deck
				current.seedIndex = 0;
			}
		}
	}

	function prev() {
		if (current?.type === 'seed') {
			const decks = reviewData.decks;

			// Prev seed
			if (current.seedIndex - 1 >= 0) {
				current.seedIndex--;
			}
			// Prev deck
			else if (current.deckIndex - 1 >= 0) {
				current.deckIndex--;
				// Go to last seed of prev deck
				current.seedIndex = decks[current.deckIndex].length - 1;
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
