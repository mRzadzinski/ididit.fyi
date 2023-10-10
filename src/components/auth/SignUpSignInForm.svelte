<script lang="ts">
	// import { goto } from '$app/navigation';
	import { sendEmailLink, signInWithPassword } from '$lib/firebase/auth/emailAuth';
	import { signUpError, signInError } from '$lib/stores/firebaseErrors';
	import ErrorMessage from '../ErrorMessage.svelte';

	export let signUp: boolean;
	export let emailLinkSignIn: boolean;
	export let toggleEmailSignIn: () => void;
	let email: string;
	let password = '';
	let inProgress = false;

	const onSubmit = async () => {
		if (signUp || emailLinkSignIn) {
			inProgress = true;
			await sendEmailLink(email);
			if ($signUpError === '') {
				// goto('/auth/link-sent');
			}
			inProgress = false;
		} else {
			inProgress = true;
			await signInWithPassword(email, password);
			inProgress = false;
		}
	};
</script>

<form on:submit|preventDefault={onSubmit} aria-label="form">
	<div class="form-control">
		<h1>
			{signUp ? 'Sign up' : 'Sign in'}
		</h1>
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
	<div class="form-control" style:display={signUp || emailLinkSignIn ? 'none' : 'flex'}>
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
				class="btn btn-xs btn-link p-0 no-underline label-text no-animation normal-case opacity-90 font-medium"
				class:invisible={signUp}
				type="button"
				on:click={toggleEmailSignIn}
			>
				Forgot password?
			</button>
		</span>
	</div>
	{#if $signUpError.length > 0}
		<ErrorMessage message={$signUpError} />
	{:else if $signInError.length > 0}
		<ErrorMessage message={$signInError} />
	{/if}
	<div class="form-control mt-6">
		<button class="btn btn-primary w-36" type="submit">
			{#if inProgress}
				<span class="loading loading-spinner" />
			{/if}
			{signUp ? 'Sign up' : 'Sign in'}
		</button>
	</div>
</form>
