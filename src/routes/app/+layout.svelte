<script>
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import Avatar from '$components/Avatar.svelte';
	import { logout } from '$lib/firebase/auth/logout';

	const sidebarListStyles = 'h-6 mb-6 text-base font-normal';

	$: if ($user === null) {
		goto('/auth/login');
	}
</script>

<div class="drawer h-screen">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<Navbar />
		<div class="flex h-full">
			<!-- Sidebar -->
			<ul class="menu p-4 w-60 min-h-full bg-base-200 hidden md:flex">
				<button class="btn btn-warning mt-3 mb-6">Daily Review</button>
				<li class={sidebarListStyles}><a>Seeds</a></li>
				<li class={sidebarListStyles}><a>Goals</a></li>
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
			<button class="btn btn-warning mt-6 mb-6">Daily Review</button>
			<li class={sidebarListStyles}><a>Seeds</a></li>
			<li class={sidebarListStyles}><a>Goals</a></li>
			<!-- Avatar -->
			<li class="w-16 h-16 flex items-center self-end mt-auto mb-4">
				<button class="p-0" id="avatar-sidebar-dropdown">
					<div class="dropdown dropdown-top dropdown-end">
						<label tabindex="-1" for="avatar-sidebar-dropdown">
							<Avatar />
						</label>
						<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
							<!-- svelte-ignore a11y-missing-attribute -->
							<li><a>Settings</a></li>
							<!-- svelte-ignore a11y-missing-attribute -->
							<li>
								<a role="button" tabindex="0" on:click={() => logout()} on:keydown={() => logout()}
									>Log Out</a
								>
							</li>
						</ul>
					</div>
				</button>
			</li>
		</ul>
	</div>
</div>

<style>
	ul.dropdown-content {
		bottom: 64px;
	}
</style>
