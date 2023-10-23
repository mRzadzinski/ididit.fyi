<script lang="ts">
	import { logout } from '$lib/firebase/auth/logout';
	import { logoutError } from '$lib/stores/authStores';
</script>

<main class="flex justify-center items-center flex-col h-full">
	<input
		class="input input-sm input-bordered w-56 visible lg:hidden mt-5 mb-5"
		type="text"
		placeholder="Search..."
	/>
	<h1 class="text-5xl mb-3">App</h1>
	<button
		on:click={async () => {
			const result = await logout();
		}}
		class="btn">Log Out</button
	>
</main>
