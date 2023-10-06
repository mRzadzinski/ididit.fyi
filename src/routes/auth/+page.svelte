<script lang="ts">
	import SignUpSignInForm from '../../components/auth/SignUpSignInForm.svelte';
	import ToggleSignUp from '../../components/auth/ToggleSignUp.svelte';
	import LoginProviders from '../../components/auth/LoginProviders.svelte';

	let signUp = false;
	let emailLinkSignIn = false;

	function toggleSignUp() {
		signUp = !signUp;
	}

	function toggleEmailSignIn() {
		emailLinkSignIn = !emailLinkSignIn;
	}
</script>

<SignUpSignInForm {signUp} {emailLinkSignIn} />
<div class="divider">OR</div>
<LoginProviders {signUp} {emailLinkSignIn} {toggleEmailSignIn} />
<ToggleSignUp {signUp} {toggleSignUp} />
