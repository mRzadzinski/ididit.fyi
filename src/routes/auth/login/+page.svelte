<script lang="ts">
	import RegisterLoginForm from '$components/auth/RegisterLoginForm.svelte';
	import ToggleRegister from '$components/auth/ToggleRegister.svelte';
	import LoginProviders from '$components/auth/LoginProviders.svelte';
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';

	$: if ($user) {
		goto('/');
	}

	let register = false;
</script>

{#if $user === null}
	<RegisterLoginForm {register} />
	<div class="divider">OR</div>
	<LoginProviders {register} />
	<ToggleRegister {register} />
{/if}
