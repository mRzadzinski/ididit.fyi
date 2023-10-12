<script lang="ts">
	import { goto } from '$app/navigation';
	import { sendEmailLink, loginWithPassword } from '$lib/firebase/auth/emailAuth';
	import { registerError, loginError } from '$lib/stores/authStores';
	import ErrorMessage from '../ErrorMessage.svelte';
	import { emailLinkLogin } from '$lib/stores/authStores';

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

<form aria-label="form">
	<div class="form-control">
		<h1>
			{register ? 'Register' : 'Login'}
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
	<div class="form-control" style:display={register || $emailLinkLogin ? 'none' : 'flex'}>
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
	{#if $registerError.length > 0}
		<ErrorMessage message={$registerError} />
	{:else if $loginError.length > 0}
		<ErrorMessage message={$loginError} />
	{/if}
	<div class="form-control mt-7">
		<!-- Submitting form with empty, display: none input doesn't work in Safari.
			moving submit handler to on button click.  -->
		<button class="btn btn-primary w-36" on:click={onSubmit}>
			{#if inProgress}
				<span class="loading loading-spinner" />
			{/if}
			{register ? 'Register' : 'Log In'}
		</button>
	</div>
</form>
