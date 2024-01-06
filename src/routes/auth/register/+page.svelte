<script lang="ts">
	import AuthForm from '$components/auth/AuthForm.svelte';
	import ToggleRegister from '$components/auth/ToggleRegister.svelte';
	import LoginProviders from '$components/auth/LoginProviders.svelte';
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';

	$: if ($user) {
		goto('/app');
	}

	let register = true;
</script>

{#if $user === null}
	<AuthForm {register} />
	<div class="divider">OR</div>
	<LoginProviders {register} />
	<ToggleRegister {register} />
{/if}
