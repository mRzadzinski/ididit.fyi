<script lang="ts">
	import { goto } from '$app/navigation';
	import { sendEmailLink, loginWithPassword } from '$lib/firebase/auth/emailAuth';
	import { registerError, loginError, emailLinkLogin } from '$lib/stores/authStores';
	import ErrorMessage from '$components/general/ErrorMessage.svelte';
	import { signInAnonymously } from 'firebase/auth';
	import { auth } from '$lib/firebase/firebase';

	export let register: boolean;
	let email: string;
	let password = '';
	let inProgress = false;

	const onSubmit = async () => {
		if (register || $emailLinkLogin) {
			inProgress = true;
			await sendEmailLink(email);
			if ($registerError === '') {
				goto('/auth/link-sent');
			}
			inProgress = false;
		} else {
			inProgress = true;
			await loginWithPassword(email, password);
			inProgress = false;
		}
	};
</script>

<form class="h-[21rem]" aria-label="form" on:submit|preventDefault={onSubmit}>
	<div class="form-control justify-center">
		<div class="flex justify-between">
			<h1>
				{#if register}
					Register
				{:else if $emailLinkLogin}
					Login with link
				{:else}
					Login
				{/if}
			</h1>
			<button
				class="btn bg-[var(--main)] w-24 min-h-[2.5rem] h-11 -mt-1"
				type="button"
				on:click={async () => {
					loginError.set('');
					registerError.set('');
					inProgress = true;
					await signInAnonymously(auth);
					inProgress = false;
				}}
				>DEMO
			</button>
		</div>
		<label for="email-input" class="label">
			<span class="label-text">Email</span>
		</label>
		<input
			bind:value={email}
			required
			id="email-input"
			type="email"
			placeholder="email"
			class="input input-bordered"
		/>
	</div>
	<div class="flex form-control {register || $emailLinkLogin ? 'invisible' : ''}">
		<label for="password-input" class="label">
			<span class="label-text">Password</span>
		</label>
		<input
			bind:value={password}
			required
			id="password-input"
			type="password"
			placeholder="password"
			minlength="12"
			maxlength="128"
			class="input input-bordered"
		/>

		<span class="w-full mt-2">
			<button
				class="btn btn-xs btn-link p-0 no-underline label-text no-animation opacity-90 font-medium"
				class:invisible={register}
				type="button"
				on:click={() => {
					loginError.set('');
					emailLinkLogin.set(true);
				}}
			>
				Forgot password?
			</button>
		</span>
	</div>
	<div class="form-control mt-7">
		<!-- Submitting form with empty, display: none input doesn't work in Safari.
			moving submit handler to on button click.  -->
		<button class="btn bg-[var(--main)] w-36 min-h-[2.5rem] h-11" type="submit">
			{#if inProgress}
				<span class="loading loading-spinner" />
			{/if}
			{register ? 'Register' : 'Log In'}
		</button>
	</div>
</form>

{#if $registerError.length > 0}
	<div class="absolute -bottom-8 left-0 w-[384px]">
		<ErrorMessage message={$registerError} />
	</div>
{:else if $loginError.length > 0}
	<div class="absolute -bottom-8 left-0 w-[384px]">
		<ErrorMessage message={$loginError} />
	</div>
{/if}

<style>
	.btn-link {
		text-transform: none;
	}
</style>
