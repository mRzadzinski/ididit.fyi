<script>
	import { goto } from '$app/navigation';
	import Avatar from './Avatar.svelte';
	import DropdownMenuItems from './DropdownMenuItems.svelte';
</script>

<div class="w-full navbar bg-base-300">
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
	<div class="prose max-w-none flex-1 px-2 mx-2">
		<button on:click={() => goto('/app')}><h2 class="m-0">ididit.fyi</h2></button>
	</div>
	<div class="flex-none items-center hidden md:block">
		<ul class="menu menu-horizontal p-0 mr-3 flex items-center">
			<!-- Navbar menu content here -->
			<input class="input input-sm input-bordered w-56 mr-10" type="text" placeholder="Search..." />
			<li>
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
			</li>
		</ul>
	</div>
</div>

<style>
	ul.dropdown-content {
		top: 62px;
	}
</style>
