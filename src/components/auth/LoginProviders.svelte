<script lang="ts">
	import Google from '~icons/fa6-brands/google';
	import Email from '~icons/ic/round-link';
	import Password from '~icons/ic/baseline-lock';
	import { goto } from '$app/navigation';
	import { emailLinkLogin } from '$lib/stores/authStores';
	import { loginError, registerError } from '$lib/stores/authStores';

	export let register: boolean;
	const iconsColor = 'hsl(var(--bc)/.8)';

	function toggleEmailLogin() {
		emailLinkLogin.update((prev) => !prev);
		registerError.set('');
		loginError.set('');
	}
</script>

<div class="flex justify-center gap-5 w-full h-10">
	{#if !register}
		<div
			class="tooltip tooltip-bottom"
			data-tip={$emailLinkLogin ? 'Login with email and password' : 'Login with email link'}
			role="button"
			tabindex="0"
			on:click={toggleEmailLogin}
			on:keydown={toggleEmailLogin}
		>
			{#if $emailLinkLogin}
				<Password
					style="font-size: 2.3rem; color: {iconsColor}; cursor: pointer; margin-top: -.15rem"
				/>
			{:else}
				<Email
					style="font-size: 2.7rem; color: {iconsColor}; cursor: pointer; margin-top: -.23rem;"
				/>
			{/if}
		</div>
	{/if}
	<div
		class="tooltip tooltip-bottom"
		data-tip={register ? 'Register with Google' : 'Login with Google'}
		role="button"
		tabindex="0"
		on:click={() => goto('/auth/login-with-google')}
		on:keydown={() => goto('/auth/login-with-google')}
	>
		<Google style="font-size: 1.8rem; color: {iconsColor}; cursor: pointer; margin-top: .2rem" />
	</div>
</div>
