<script lang="ts">
	import LogSignForm from '../components/login/LogSignForm.svelte';
	import ToggleSignUp from '../components/login/ToggleSignUp.svelte';
	import LoginProviders from '../components/login/LoginProviders.svelte';

	let signUp = false;

	function toggleSignUp() {
		signUp = !signUp;
	}
</script>

<div class="prose prose-sm card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
	<div class="card-body">
		<LogSignForm {signUp} />
		<div class="divider">OR</div>
		<LoginProviders />
		<ToggleSignUp {signUp} {toggleSignUp} />
	</div>
</div>
