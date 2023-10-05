<script lang="ts">
	import { firebaseApp } from '$lib/firebase/firebase';
	import { user } from '$lib/stores/firebaseAuthStore';
	import { goto } from '$app/navigation';
	import '../app.css';

	$: if ($user) {
		goto('/');
	} else {
		goto('/login');
	}
</script>

<main class="flex h-screen justify-center items-center flex-col">
	<slot />
</main>
