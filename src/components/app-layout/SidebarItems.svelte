<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { syncInProgress } from '$lib/stores/dbStores';
	import SyncCompleteIcon from '~icons/fluent/cloud-sync-complete-28-regular';
	import Avatar from './Avatar.svelte';
	import DropdownMenuItems from './DropdownMenuItems.svelte';

	let currentURL = '';
	$: {
		currentURL = $page.url.pathname;
		console.log(currentURL);
	}
</script>

<div class="w-56 hidden md:flex flex-col justify-between">
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
	<div>
		<button class="p-0 focus:bg-current" id="avatar-nav-dropdown">
			<div class="dropdown dropdown-end">
				<label tabindex="-1" for="avatar-nav-dropdown">
					<Avatar />
				</label>
				<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
					<DropdownMenuItems />
				</ul>
			</div>
		</button>
		{#if $syncInProgress}
			<span class="loading loading-spinner loading-md mr-4 text-error" />
		{:else}
			<SyncCompleteIcon style="font-size: 1.7rem; color: hsl(var(--su)); margin-right: 1rem;" />
		{/if}
	</div>
</div>

<style>
	.btn {
		color: black;
		background-color: white;
		width: 66.666667%;
	}

	.active {
		background-color: #ffcd4c;
		color: white;
	}
</style>
