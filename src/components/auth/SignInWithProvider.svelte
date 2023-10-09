<script lang="ts">
	import { user } from '$lib/stores/firebaseStores';
	import { goto } from '$app/navigation';
	import { signInError } from '$lib/stores/firebaseErrors';
	import ErrorMessage from '../ErrorMessage.svelte';

    export let providerName: string;
</script>

{#if $user === null}
	<h1>Waiting for {providerName}...</h1>
	<div class="w-full flex justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else if $user || $user === undefined}
	<div class="w-full flex justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else if $signInError !== ''}
	<ErrorMessage message={`${providerName} sign in failed: ${$signInError}. <br>Go back to sign in page.`} />
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
