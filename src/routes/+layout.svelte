<script>
	import '../app.css';
	import { goto } from '$app/navigation';
	import { loggedIn } from '$lib/stores';
	import { firebaseApp } from '$lib/firebase/firebase';

	function toggleLoggedIn() {
		loggedIn.update((a) => !a);
	}

	$: if ($loggedIn) {
		goto('/');
	} else {
		goto('/auth');
	}
</script>

<main class="flex h-screen justify-center items-center flex-col">
	<slot />
	<button class="btn" on:click={toggleLoggedIn}>
		{#if $loggedIn}
			Log out
		{:else}
			Log in
		{/if}
	</button>
</main>
