<script>
	import { firstSignIn, user } from '$lib/stores/firebaseStores';
	import { checkGoogleSignInStatus, signInWithGoogle } from '$lib/firebase/auth/googleAuth';
	import { goto } from '$app/navigation';
	import { signInError } from '$lib/stores/firebaseErrors';
	import ErrorMessage from '../../../components/ErrorMessage.svelte';

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

{#if $user === null}
	<h1>Waiting for Google...</h1>
	<div class="w-full flex justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else if $user}
	<div class="w-full flex justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else if $signInError !== ''}
	<ErrorMessage message={`Google sign in failed: ${$signInError}. <br>Go back to sign in page.`} />
	<button
		on:click={() => {
			goto('/auth');
			signInError.set('');
		}}
		class="btn btn-active btn-neutral"
	>
		Sign in page
	</button>
{/if}
