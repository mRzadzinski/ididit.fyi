<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { syncInProgress } from '$lib/stores/dbStores';
	import SyncCompleteIcon from '~icons/material-symbols/cloud-done-outline-rounded';
	// material-symbols:cloud-done-outline-rounded
	import Avatar from './Avatar.svelte';
	import DropdownMenuItems from './DropdownMenuItems.svelte';

	let currentURL = '';
	$: currentURL = $page.url.pathname;
</script>

<div class="flex flex-col items-center">
	<div class="prose mt-8 mb-12">
		<button on:click={() => goto('/app')}><div class="text-2xl font-extrabold">IDIDIT.FYI</div></button>
	</div>
	<button
		class="btn text-xs"
		class:active={currentURL.includes('/app/seeds')}
		on:click={() => goto('/app/seeds')}>Seeds</button
	>
</div>
<div class="flex items-center gap-4 mt-auto mb-6">
	<ul class="menu min-w-fit flex">
		<li class="flex items-center">
			<button class="p-0" id="avatar-sidebar-dropdown">
				<div class="dropdown dropdown-top">
					<label tabindex="-1" for="avatar-sidebar-dropdown">
						<Avatar />
					</label>
					<ul class="dropdown-content z-[1] p-2 shadow bg-white rounded-box w-32">
						<DropdownMenuItems />
					</ul>
				</div>
			</button>
		</li>
	</ul>
	{#if $syncInProgress}
		<span class="loading loading-spinner loading-md mr-4 text-base-content" />
	{:else}
		<SyncCompleteIcon style="font-size: 1.5rem; color: oklch(var(--bc)); margin-right: 1rem;" />
	{/if}
</div>

<style>
	.menu {
		padding: 0;
	}

	.btn {
		color: black;
		background-color: white;
		width: 10rem;
		height: 2.5rem;
		min-height: unset;
	}

	.active {
		background-color: #ffcd4c;
		color: white;
	}
</style>
