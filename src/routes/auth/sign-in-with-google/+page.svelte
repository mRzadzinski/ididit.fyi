<script>
	import { firstSignIn, user } from '$lib/stores/firebaseStores';
	import { checkForFirstSignIn, signInWithGoogle } from '$lib/firebase/auth/googleAuth';
	import { goto } from '$app/navigation';
	import SignInWithProvider from '../../../components/auth/SignInWithProvider.svelte';

	let signedInWithGoogle = false;

	$: if ($user === null) {
		signInWithGoogle();
		signedInWithGoogle = true;
	} else if ($user && signedInWithGoogle) {
		checkForFirstSignIn();
	} else if ($user) {
		// User is already logged in
		goto('/');
	}

	$: if ($firstSignIn === false && $firstSignIn !== undefined) {
		goto('/');
	} else if ($firstSignIn) {
		goto('/auth/set-password');
	}
</script>

<SignInWithProvider providerName="Google" />
