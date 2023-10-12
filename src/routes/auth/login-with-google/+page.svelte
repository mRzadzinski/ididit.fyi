<script>
	import { firstLogin, user } from '$lib/stores/authStores';
	import { checkForFirstLogin, loginWithGoogle } from '$lib/firebase/auth/googleAuth';
	import { goto } from '$app/navigation';
	import LoginWithProvider from '$components/auth/LoginWithProvider.svelte';

	let loggedWithGoogle = false;

	$: if ($user === null) {
		loginWithGoogle();
		loggedWithGoogle = true;
	} else if ($user && loggedWithGoogle) {
		checkForFirstLogin();
	} else if ($user) {
		// User is already logged in
		goto('/');
	}

	$: if ($firstLogin === false && $firstLogin !== undefined) {
		goto('/');
	} else if ($firstLogin) {
		goto('/auth/set-password');
	}
</script>

<LoginWithProvider providerName="Google" />
