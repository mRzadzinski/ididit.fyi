<script>
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';
	import Navbar from '$components/app-layout/Navbar.svelte';
	import Avatar from '$components/app-layout/Avatar.svelte';
	import DropdownMenuItems from '$components/app-layout/DropdownMenuItems.svelte';
	import SidebarItems from '$components/app-layout/SidebarItems.svelte';

	$: if ($user === null) {
		goto('/auth/login');
	}
</script>

{#if $user}
	<div class="drawer h-screen bg-white">
		<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
		<!-- Sidebar -->
		<div class="w-60 h-full px-12 hidden md:flex flex-col justify-between">
			<SidebarItems />
		</div>
		<div class="drawer-content flex flex-col">
			<div class="flex flex-col h-full">
				<!-- Navbar -->
				<Navbar />
				<!-- Page content -->
				<div class="h-full w-full">
					{#if $user}
						<slot />
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
	ul.dropdown-content {
		bottom: 64px;
	}

	ul.menu {
		max-width: 280px;
	}
</style>
