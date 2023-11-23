<script>
	import { goto } from '$app/navigation';
	import { addNewItem } from '$lib/stores/helperStores';
	import PlusIcon from '~icons/uil/plus';
</script>

<div class="w-full navbar bg-base-100 mt-3">
	<!-- Content to show on small screen -->
	<div class="flex-none md:hidden">
		<label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block w-6 h-6 stroke-current"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/></svg
			>
		</label>
	</div>
	<div class="max-w-none flex-1 px-2 mx-2 flex justify-between">
		<button class="btn h-10 w-40 bg-[#ffcd4c] daily-review" on:click={() => goto('/app')}
			>Daily Review</button
		>
		<div class="flex-none items-center hidden md:block">
			<button class="btn" on:click={() => $addNewItem()}>
				<PlusIcon />
				New Deck
			</button>
		</div>
	</div>
	<!-- Content to hide on small screen -->
</div>

<style>
	ul.dropdown-content {
		top: 62px;
	}

	.daily-review {
		background-color: #ffcd4c;
	}
</style>
