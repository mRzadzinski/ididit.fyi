<script lang="ts">
	import LogSignForm from '../components/login/LogSignForm.svelte';
	import ToggleSignUp from '../components/login/ToggleSignUp.svelte';
	import LoginProviders from '../components/login/LoginProviders.svelte';
	import { user } from '$lib/stores/firebaseAuthStore';

	let signUp = false;
	let passwordLogin = false;

	function toggleSignUp() {
		signUp = !signUp;
	}

	function toggleEmailLogin() {
		passwordLogin = !passwordLogin;
	}
</script>

{#if $user === undefined || $user === null}
	<div class="prose prose-sm card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
		<div class="card-body">
			<LogSignForm {signUp} {passwordLogin} />
			<div class="divider">OR</div>
			<LoginProviders {signUp} {passwordLogin} {toggleEmailLogin} />
			<ToggleSignUp {signUp} {toggleSignUp} />
		</div>
	</div>
{/if}
