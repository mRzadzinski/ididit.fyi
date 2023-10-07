<script lang="ts">
	import { auth } from '$lib/firebase/firebase';
	import { getAdditionalUserInfo, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
	import WarningMessage from '../../../components/WarningMessage.svelte';
	import ErrorMessage from '../../../components/ErrorMessage.svelte';
	import { signInError } from '$lib/stores/firebaseErrors';
	import { firstSignIn } from '$lib/stores/firebaseStores';
	import { goto } from '$app/navigation';

	let inputValue: string;
	let email: string | null;
	let linkEvaluated = false;
	let wrongLink = false;
	let inProgress = false;

	function timeout(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function confirmSignIn() {
		try {
			if (!linkEvaluated) {
				if (isSignInWithEmailLink(auth, window.location.href)) {
					linkEvaluated = true;
					email = window.localStorage.getItem('emailForSignIn');
					window.localStorage.removeItem('emailForSignIn');
				} else {
					wrongLink = true;
					return;
				}
			}
			if (email) {
				await timeout(1500);
				const user = await signInWithEmailLink(auth, email);
				firstSignIn.set(getAdditionalUserInfo(user)?.isNewUser);
				signInError.set('');

				if ($firstSignIn) {
					goto('/auth/set-password');
				} else {
					goto('/');
				}
			}
		} catch (error) {
			if (
				typeof error === 'object' &&
				error &&
				'message' in error &&
				typeof error.message === 'string'
			)
				signInError.set(error.message.replace('Firebase: ', ''));
		}
	}
	confirmSignIn();

	$: if ($signInError) {
		wrongLink = true;
	}
</script>

{#if wrongLink}
	<WarningMessage message="Link inactive. Go to sign in page." />
	{#if inProgress}
		<span class="loading loading-spinner" />
	{:else}
		<button
			on:click={() => {
				inProgress = true;
				goto('/auth');
				signInError.set('');
			}}
			class="btn btn-active btn-neutral"
		>
			Sign in page
		</button>
	{/if}
{:else if email || !linkEvaluated}
	<h1>Signing in...</h1>
	<div class="w-full flex justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else if !email && linkEvaluated}
	<h1>Enter your email</h1>
	<form on:submit|preventDefault={() => {}} aria-label="form">
		<div class="form-control">
			<label for="email-input" class="label">
				<span class="label-text">Email</span>
			</label>
			<input
				bind:value={inputValue}
				required
				id="email-input"
				type="email"
				placeholder="email"
				class="input input-bordered"
			/>
		</div>
		{#if $signInError.length > 0}
			<ErrorMessage message={$signInError} />
		{/if}
		<div class="form-control mt-6">
			<button
				class="btn btn-primary w-36"
				type="button"
				on:click={() => {
					email = inputValue;
					confirmSignIn();
				}}>Sign in</button
			>
		</div>
	</form>
{/if}
