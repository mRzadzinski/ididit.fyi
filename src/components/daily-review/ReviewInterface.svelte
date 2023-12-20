<script lang="ts">
	import ButtonClose from '../common/ButtonClose.svelte';
	import ReviewModal from './ReviewModal.svelte';
	import ButtonArrowLeft from '../common/ButtonArrowLeft.svelte';
	import ReviewContentSeed from './ReviewContentSeed.svelte';
	import ReviewInstructions from './ReviewInstructions.svelte';
	import { seedsData } from '$lib/stores/dbStores';

	export let closeReview: () => void;
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
				<ButtonArrowLeft handler={() => {}} />
			</div>
			<div class="px-16">
				<ReviewContentSeed seed={$seedsData.decks[0].seeds[1]} />
			</div>
			<!-- Rotate 180 deg to get arrow right -->
			<div class="mr-4 rotate-180">
				<ButtonArrowLeft handler={() => {}} />
			</div>
		</div>
		<ReviewInstructions />
	</div>
</ReviewModal>
