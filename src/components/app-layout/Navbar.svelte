<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { addNewItem, disableNewItemBtn, newItemBtnName } from '$lib/stores/helperStores';
	import PlusIcon from '~icons/uil/plus';
</script>

<div class="w-full navbar min-h-min mt-10 mb-16 p-0">
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
	<div class="max-w-none flex-1 flex justify-between">
		<button
			class="btn min-w-fit w-40 bg-white
				{$page.url.pathname === '/app/daily-review' ? 'invisible' : ''}"
			on:click={() => goto('/app/daily-review')}>Daily Review</button
		>
		<div class="flex-none items-center">
			{#if $newItemBtnName.length > 0}
				{#if !$disableNewItemBtn}
					<button class="btn w-32 bg-white" on:click={() => $addNewItem()}>
						<PlusIcon />
						New {$newItemBtnName}
					</button>
				{:else}
					<button class="btn btn-disabled w-32 bg-white" tabindex="-1" aria-disabled="true">
						<PlusIcon />
						New {$newItemBtnName}
					</button>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.btn {
		height: 2.5rem;
		min-height: unset;
		font-size: 0.75rem;
	}
</style>
