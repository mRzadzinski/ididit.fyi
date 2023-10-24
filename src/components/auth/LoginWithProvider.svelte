<script lang="ts">
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';
	import { loginError } from '$lib/stores/authStores';
	import ErrorMessage from '$components/general/ErrorMessage.svelte';

	export let providerName: string;
</script>

{#if $user === null}
	<h1>Waiting for {providerName}...</h1>
	<div class="w-full flex justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else if $user}
	<div class="w-full flex flex-col justify-center">
		<h1>ididit.fyi</h1>
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else if $loginError !== ''}
	<ErrorMessage
		message={`${providerName} login failed: ${$loginError}. <br>Go back to login page.`}
	/>
	<button
		on:click={() => {
			goto('/auth');
			loginError.set('');
		}}
		class="btn btn-active btn-neutral"
	>
		Login page
	</button>
{/if}
