<script>
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';
	import Navbar from '$components/Navbar.svelte';
	import src from '../../static/profile.jpg';

	const sidebarListStyles = 'h-6 mb-6 text-lg font-semibold';

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
			<ul class="menu p-4 w-60 min-h-full bg-base-200 hidden lg:flex">
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
		<ul class="menu p-4 w-80 min-h-full bg-base-200 flex">
			<!-- Sidebar content here -->
			<!-- Close icon -->
			<svg
				class="fill-base-content self-end cursor-pointer mb-4"
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 -960 960 960"
				width="24"
				><path
					d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
				/></svg
			>
			<button class="btn btn-warning mt-3 mb-6">Daily Review</button>
			<li class={sidebarListStyles}><a>Seeds</a></li>
			<li class={sidebarListStyles}><a>Goals</a></li>
			<!-- Avatar -->
			<li class="w-16 h-16 flex items-center self-end mt-auto mb-4">
				<div class="avatar p-1">
					<div class="w-12 rounded-full">
						<img {src} alt="avatar" />
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>
