<script>
	import { firstSignIn, user } from '$lib/stores/firebaseStores';
	import { checkForFirstSignIn, signInWithGoogle } from '$lib/firebase/auth/googleAuth';
	import { goto } from '$app/navigation';
	import SignInWithProvider from '../../../components/auth/SignInWithProvider.svelte';

	$: if ($user === null) {
		signInWithGoogle();
	} else if ($user) {
		checkForFirstSignIn();
	}

	$: if ($firstSignIn === false && $firstSignIn !== undefined) {
		goto('/');
	} else if ($firstSignIn) {
		goto('/auth/set-password');
	}
</script>

<SignInWithProvider providerName="Google" />
