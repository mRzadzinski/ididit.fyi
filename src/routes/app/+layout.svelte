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
	<div class="drawer h-screen">
		<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<Navbar />
			<div class="flex h-full">
				<!-- Sidebar -->
				<ul class="menu p-4 w-60 min-h-full bg-base-300 hidden md:flex">
					<SidebarItems />
				</ul>
				<!-- Page content -->
				<div class="flex flex-col flex-1 items-center h-full">
					{#if $user}
						<slot />
					{/if}
				</div>
			</div>
		</div>

		<!-- Drawer -->
		<div class="drawer-side">
			<label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay" />
			<ul class="menu p-4 min-w-fit w-80 min-h-full bg-base-200 flex">
				<!-- Sidebar content here -->
				<SidebarItems />
				<!-- Avatar -->
				<li class="w-16 h-16 flex items-center self-end mt-auto mb-4">
					<button class="p-0" id="avatar-sidebar-dropdown">
						<div class="dropdown dropdown-top dropdown-end">
							<label tabindex="-1" for="avatar-sidebar-dropdown">
								<Avatar />
							</label>
							<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
								<DropdownMenuItems />
							</ul>
						</div>
					</button>
				</li>
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
