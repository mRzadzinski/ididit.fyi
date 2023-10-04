<script>
	import '../app.css';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/firebaseAuthStore';
	import { firebaseApp } from '$lib/firebase/firebase';

	$: if ($authUser) {
		goto('/');
	} else {
		goto('/login');
	}
</script>

<main class="flex h-screen justify-center items-center flex-col">
	<slot />
</main>
