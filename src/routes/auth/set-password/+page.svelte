<script lang="ts">
	import { auth } from '$lib/firebase/firebase';
	import { updatePassword } from 'firebase/auth';
	import { updatePasswordError } from '$lib/stores/authStores';
	import WarningMessage from '../../../components/general/WarningMessage.svelte';
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';

	let password: string;
	let passwordConfirm: string;
	let inProgress = false;
	let passwordUpdated = false;

	$: if ($user === null) {
		goto('/auth/login');
	}

	async function setPassword() {
		let authUser = auth.currentUser;
		try {
			if (password === passwordConfirm && password.length >= 12) {
				if (authUser !== null) {
					inProgress = true;
					await updatePassword(authUser, password);
					inProgress = false;
					passwordUpdated = true;
					updatePasswordError.set('');
				}
			} else if (password !== passwordConfirm) {
				updatePasswordError.set("Passwords don't match");
			} else if (password.length < 12) {
				updatePasswordError.set('Password too short, 12 characters minimum.');
			}
		} catch (error) {
			if (
				typeof error === 'object' &&
				error &&
				'message' in error &&
				typeof error.message === 'string'
			)
				updatePasswordError.set(error.message.replace('Firebase: ', ''));
		}
	}
</script>

{#if $user}
	{#if passwordUpdated}
		<h1>New password saved</h1>
		<button class="btn btn-primary w-36" type="submit" on:click={() => goto('/app')}>
			{#if inProgress}
				<span class="loading loading-spinner" />
			{/if}
			Go to App
		</button>
	{:else}
		<form aria-label="form">
			<h1>Set password</h1>
			<div class="flex mb-5 w-full">
				<div class="badge badge-neutral mr-2">optional</div>
				<div class="text-xs flex items-center">Enables login with email and password</div>
			</div>
			<label for="email-input" class="label">
				<span class="label-text">Email</span>
			</label>
			<input
				value={$user.email}
				id="email-input"
				type="email"
				placeholder="email"
				disabled
				class="input input-bordered w-full"
			/>
			<div class="form-control">
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
					autocomplete="new-password"
					class="input input-bordered"
				/>
			</div>
			<div class="form-control">
				<label for="password-confirmation-input" class="label">
					<span class="label-text">Confirm password</span>
				</label>
				<input
					bind:value={passwordConfirm}
					required
					id="password-confirmation-input"
					type="password"
					placeholder="confirm password"
					minlength="12"
					maxlength="128"
					autocomplete="new-password"
					class="input input-bordered"
				/>
			</div>
			{#if $updatePasswordError.length > 0}
				<WarningMessage message={$updatePasswordError} />
			{/if}

			<div class="form-control mt-6">
				<button
					class="btn btn-primary w-36"
					type="button"
					on:click={async () => await setPassword()}
				>
					{#if inProgress}
						<span class="loading loading-spinner" />
					{/if}
					Save
				</button>
			</div>
			<div class="mt-5 w-full">
				<button
					on:click={() => {
						goto('/app');
					}}
					class="btn btn-xs btn-link p-0 no-underline label-text no-animation normal-case opacity-90 font-medium"
				>
					Do it later in settings
				</button>
			</div>
		</form>
	{/if}
{/if}
