<script>
	import { firebaseApp } from '$lib/firebase/firebase';
	import '../app.css';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/firebaseAuthStore';

	$: if ($user) {
		goto('/');
	} else {
		goto('/login');
	}
</script>

<main class="flex h-screen justify-center items-center flex-col">
	<slot />
</main>
