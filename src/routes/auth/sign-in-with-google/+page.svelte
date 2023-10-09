<script>
	import { firstSignIn, user } from '$lib/stores/firebaseStores';
	import { checkGoogleSignInStatus, signInWithGoogle } from '$lib/firebase/auth/googleAuth';
	import { goto } from '$app/navigation';

	$: if ($user === null) {
		signInWithGoogle();
	} else if ($user) {
		checkGoogleSignInStatus();
	}

	$: if ($firstSignIn !== undefined && !$firstSignIn) {
		goto('/');
	} else if ($firstSignIn) {
		goto('/auth/set-password');
	}
</script>

<h1>hello hello google</h1>
