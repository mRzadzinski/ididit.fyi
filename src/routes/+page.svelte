<script>
	import { logout } from '$lib/firebase/auth/logout';
	import { logoutError } from '$lib/stores/firebaseAuthStore';
</script>

<h1 class="text-5xl mb-3">App</h1>
<button
	on:click={async () => {
		const result = await logout();
		logoutError.set(result.replace('Firebase: ', ''));
	}}
	class="btn">Logout</button
>
