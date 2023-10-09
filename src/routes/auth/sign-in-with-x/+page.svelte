<script>
	import { firstSignIn, user } from '$lib/stores/firebaseStores';
	import { checkXSignInStatus, signInWithX } from '$lib/firebase/auth/xAuth';
	import { goto } from '$app/navigation';
	import SignInWithProvider from '../../../components/auth/SignInWithProvider.svelte';

	$: if ($user === null) {
		signInWithX();
	} else if ($user) {
		checkXSignInStatus();
	}

	$: if ($firstSignIn === false && $firstSignIn !== undefined) {
		goto('/');
	} else if ($firstSignIn) {
		goto('/auth/set-password');
	}
</script>

<SignInWithProvider providerName="X" />
