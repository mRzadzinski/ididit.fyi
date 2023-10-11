<script lang="ts">
	import SignUpSignInForm from '../../components/auth/SignUpSignInForm.svelte';
	import ToggleSignUp from '../../components/auth/ToggleSignUp.svelte';
	import LoginProviders from '../../components/auth/LoginProviders.svelte';
	import { signInError, signUpError } from '$lib/stores/firebaseErrors';
	import { user } from '$lib/stores/firebaseStores';
	import { goto } from '$app/navigation';

	$: if ($user) {
		goto('/');
	}

	let signUp = false;
	let emailLinkSignIn = false;

	function toggleSignUp() {
		signUp = !signUp;
		signUpError.set('');
		signInError.set('');
	}

	function toggleEmailSignIn() {
		emailLinkSignIn = !emailLinkSignIn;
		signUpError.set('');
		signInError.set('');
	}
</script>

{#if $user === null}
	<SignUpSignInForm {signUp} {emailLinkSignIn} {toggleEmailSignIn} />
	<div class="divider">OR</div>
	<LoginProviders {signUp} {emailLinkSignIn} {toggleEmailSignIn} />
	<ToggleSignUp {signUp} {toggleSignUp} />
{/if}
