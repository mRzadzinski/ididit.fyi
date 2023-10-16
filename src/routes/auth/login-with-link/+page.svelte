<script lang="ts">
	import { auth } from '$lib/firebase/firebase';
	import { getAdditionalUserInfo, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
	import WarningMessage from '$components/WarningMessage.svelte';
	import ErrorMessage from '$components/ErrorMessage.svelte';
	import { loginError, firstLogin } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/authStores';
	import { logout } from '$lib/firebase/auth/logout';

	let inputValue: string;
	let email: string | null;
	let linkEvaluated = false;
	let wrongLink = false;
	let inProgress = false;

	// function timeout(ms: number) {
	// 	return new Promise((resolve) => setTimeout(resolve, ms));
	// }

	async function confirmLogin() {
		try {
			if ($user) logout();

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
				// await timeout(1500);
				const userInfo = await signInWithEmailLink(auth, email);
				firstLogin.set(getAdditionalUserInfo(userInfo)?.isNewUser);
				loginError.set('');

				if ($firstLogin) {
					goto('/auth/set-password');
				} else {
					goto('/app');
				}
			}
		} catch (error) {
			if (
				typeof error === 'object' &&
				error &&
				'message' in error &&
				typeof error.message === 'string'
			) {
				inProgress = false;
				loginError.set(error.message.replace('Firebase: ', ''));
			}
		}
	}
	confirmLogin();

	$: if ($loginError) {
		wrongLink = true;
	}
</script>

{#if wrongLink}
	<WarningMessage message="Link inactive. Go to login page." />
	<button
		on:click={() => {
			inProgress = true;
			goto('/auth/login');
			loginError.set('');
		}}
		class="btn btn-active btn-neutral"
	>
		{#if inProgress}
			<span class="loading loading-spinner" />
		{/if}
		Login
	</button>
{:else if email || !linkEvaluated}
	<h1>Logging in...</h1>
	<div class="w-full flex justify-center">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else if !email && linkEvaluated}
	<h1>Enter your email</h1>
	<form aria-label="form">
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
		{#if $loginError.length > 0}
			<ErrorMessage message={$loginError} />
		{/if}
		<div class="form-control mt-6">
			<button
				class="btn btn-primary w-36"
				type="button"
				on:click={() => {
					email = inputValue;
					inProgress = true;
					confirmLogin();
				}}
			>
				{#if inProgress}
					<span class="loading loading-spinner" />
				{/if}
				Log In
			</button>
		</div>
	</form>
{/if}
