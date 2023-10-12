<script lang="ts">
	import { logout } from '$lib/firebase/auth/logout';
	import { logoutError } from '$lib/stores/authStores';
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';

	$: if ($user === null) {
		goto('/auth');
	}
</script>

{#if $user}
	<main class="flex h-screen justify-center items-center flex-col">
		<h1 class="text-5xl mb-3">App</h1>
		<button
			on:click={async () => {
				const result = await logout();
			}}
			class="btn">Log Out</button
		>
	</main>
{/if}
