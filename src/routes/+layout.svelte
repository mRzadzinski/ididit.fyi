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
		goto('/login');
	}
</script>

<main class="flex h-screen justify-center items-center flex-col">
	<slot />
</main>
