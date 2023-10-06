<script lang="ts">
	import { auth } from '$lib/firebase/firebase';
	import { updatePassword } from 'firebase/auth';
	import { updatePasswordError } from '$lib/stores/firebaseErrors';
	import { user } from '$lib/stores/firebaseAuthStore';
	import ErrorMessage from '../../../components/ErrorMessage.svelte';
	import { goto } from '$app/navigation';

	let password: string;
	let passwordConfirm: string;
	let inProgress = false;
	let passwordUpdated = false;

	$: if ($user === null) {
		goto('/auth');
	}

	async function setPassword() {
		let authUser = auth.currentUser;
		try {
			console.log('hello1');
			if (password === passwordConfirm && password.length >= 12) {
				console.log('hello2');
				if (authUser !== null) {
					inProgress = true;
					await updatePassword(authUser, password);
					inProgress = false;
					passwordUpdated = true;
					updatePasswordError.set('');
				}
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

{#if $user && $user !== undefined}
	<main class="flex h-screen justify-center items-center flex-col">
		<div class="prose prose-sm card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<div class="card-body">
				{#if passwordUpdated}
					<h1>New password saved</h1>
					<button class="btn btn-primary w-36" type="submit" on:click={() => goto('/')}>
						{#if inProgress}
							<span class="loading loading-spinner" />
						{/if}
						Go to app
					</button>
					{:else}
					<form on:submit|preventDefault={async () => await setPassword()} aria-label="form">
						<h1>Set password</h1>
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
								class="input input-bordered"
							/>
						</div>
						{#if $updatePasswordError.length > 0}
							<ErrorMessage message={$updatePasswordError} />
						{:else if $updatePasswordError.length > 0}
							<ErrorMessage message={$updatePasswordError} />
						{/if}
	
						<div class="form-control mt-6">
							<button class="btn btn-primary w-36" type="submit">
								{#if inProgress}
									<span class="loading loading-spinner" />
								{/if}
								Save
							</button>
						</div>
					</form>
				{/if}

			</div>
		</div>
	</main>
{/if}
