<script>
	import { firstLogin, user } from '$lib/stores/authStores';
	import { checkForFirstLogin, loginWithGoogle } from '$lib/firebase/auth/googleAuth';
	import { goto } from '$app/navigation';
	import LoginWithProvider from '$components/auth/LoginWithProvider.svelte';

	$: if ($user === null) {
		loginWithGoogle();
	} else if ($user) {
		(async () => {
			const result = await checkForFirstLogin();
			if (result === null) {
				goto('/app');
			}
		})();
	}

	$: if ($firstLogin === false && $firstLogin !== undefined) {
		goto('/app');
	} else if ($firstLogin) {
		goto('/auth/set-password');
	}
</script>

<LoginWithProvider providerName="Google" />
