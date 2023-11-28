<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { syncInProgress } from '$lib/stores/dbStores';
	import SyncCompleteIcon from '~icons/fluent/cloud-sync-complete-28-regular';
	import Avatar from './Avatar.svelte';
	import DropdownMenuItems from './DropdownMenuItems.svelte';

	let currentURL = '';
	$: currentURL = $page.url.pathname;
</script>

<div class="flex flex-col items-center">
	<div class="prose mt-8 mb-12">
		<button on:click={() => goto('/app')}><h2 class="m-0">ididit.fyi</h2></button>
	</div>
	<button
		class="btn"
		class:active={currentURL.includes('/app/seeds')}
		on:click={() => goto('/app/seeds')}>Seeds</button
	>
</div>
<div class="flex items-center gap-2 mt-auto mb-3">
	<ul class="menu min-w-fit flex">
		<li class="flex items-center">
			<button class="p-0" id="avatar-sidebar-dropdown">
				<div class="dropdown dropdown-top">
					<label tabindex="-1" for="avatar-sidebar-dropdown">
						<Avatar />
					</label>
					<ul class="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52">
						<DropdownMenuItems />
					</ul>
				</div>
			</button>
		</li>
	</ul>
	{#if $syncInProgress}
		<span class="loading loading-spinner loading-md mr-4 text-error" />
	{:else}
		<SyncCompleteIcon style="font-size: 1.7rem; color: oklch(var(--su)); margin-right: 1rem;" />
	{/if}
</div>

<style>
	.menu {
		padding: 0;
	}

	.btn {
		color: black;
		background-color: white;
		width: 100%;
		height: 2.5rem;
		min-height: unset;
	}

	.active {
		background-color: #ffcd4c;
		color: white;
	}
</style>
