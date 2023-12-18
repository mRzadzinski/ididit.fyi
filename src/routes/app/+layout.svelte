<script>
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';
	import Navbar from '$components/app-layout/Navbar.svelte';
	import SidebarItems from '$components/app-layout/SidebarItems.svelte';
	import { keepScrollContainerWidthInSyncWithDndItem } from '../../lib/dnd/verticalListLifecycle';

	$: if ($user === null) {
		goto('/auth/login');
	}
</script>

<svelte:window on:resize={() => keepScrollContainerWidthInSyncWithDndItem()} />
{#if $user}
	<div class="drawer min-h-screen bg-white max-w-screen-xl app">
		<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
		<!-- Sidebar -->
		<div class="w-60 h-full px-10 hidden md:flex flex-col justify-between">
			<SidebarItems />
		</div>
		<div class="drawer-content flex flex-col">
			<div class="flex flex-col h-full pl-6 pr-12">
				<!-- Navbar -->
				<Navbar />
				<!-- Page content -->
				<div class="h-full w-full">
					{#if $user}
						<main class="h-full w-full m-0">
							<slot />
						</main>
					{/if}
				</div>
			</div>
		</div>

		<!-- Drawer -->
		<div class="drawer-side">
			<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay" />
			<ul class="menu px-14 py-0 min-w-fit w-80 min-h-full bg-base-100 flex">
				<!-- Sidebar content here -->
				<SidebarItems />
			</ul>
		</div>
	</div>
{/if}

<style>
	ul.menu {
		max-width: 280px;
	}
</style>
