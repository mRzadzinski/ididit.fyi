<script lang="ts">
	import { loginWithEmailLink, loginWithPassword } from '$lib/firebase/auth/emailAuth';
	import { signUpError, loginError } from '$lib/stores/firebaseAuthStore';
	import ErrorMessage from '../ErrorMessage.svelte';

	export let signUp: boolean;
	export let passwordLogin: boolean;
	let email: string;
	let password: string = '';

	const onSubmit = async () => {
		// if (signUp) {
		// 	const result = await signUpWithEmail(email, password);
		// 	signUpError.set(result.replace('Firebase: ', ''));
		// } else {
		// 	const result = await loginWithEmail(email, password);
		// 	loginError.set(result.replace('Firebase: ', ''));
		// }
	};
</script>

<form on:submit|preventDefault={onSubmit} aria-label="form">
	<div class="form-control">
		<h1>
			{signUp ? 'Sign up' : 'Login'}
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
	<div class="form-control" style:display={signUp || passwordLogin ? 'none' : 'flex'}>
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
			>
				Forgot password?
			</button>
		</span>
	</div>
	{#if $signUpError.length > 0}
		<ErrorMessage message={$signUpError} />
	{:else if $loginError.length > 0}
		<ErrorMessage message={$loginError} />
	{/if}
	<div class="form-control mt-6">
		<button class="btn btn-primary w-36" type="submit">
			{signUp ? 'Sign up' : 'Login'}
		</button>
	</div>
</form>
