<script lang="ts">
	import CloseReview from '../common/ButtonClose.svelte';
	import ReviewModal from './ReviewModal.svelte';
	import ButtonArrowLeft from '../common/ButtonArrowLeft.svelte';

	export let closeReview: () => void;
</script>

<ReviewModal>
	<div class="flex flex-col max-w-screen-xl w-full h-full">
		<progress class="progress w-full" value="70" max="100" />
		<div class="self-end mr-4 mt-4">
			<CloseReview handler={closeReview} />
		</div>
		<div class="grow flex justify-between items-center">
			<div class="ml-4"><ButtonArrowLeft handler={() => {}} /></div>
			content
			<!-- Rotate 180 deg to get arrow right -->
			<div class="mr-4 rotate-180"><ButtonArrowLeft handler={() => {}} /></div>
		</div>
		<div class="flex justify-center items-center gap-4 h-20">
			<span>Use</span>
			<div class="flex justify-center gap-1">
				<kbd class="kbd">◀︎</kbd>
				<kbd class="kbd">▶︎</kbd>
			</div>
			<span>or press</span>
			<kbd class="kbd">Spacebar</kbd>
		</div>
	</div>
</ReviewModal>
