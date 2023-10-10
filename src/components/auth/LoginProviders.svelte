<script lang="ts">
	import Google from '~icons/fa6-brands/google';
	import Email from '~icons/ic/round-link';
	import Password from '~icons/ic/baseline-lock';
	import { goto } from '$app/navigation';

	export let signUp: boolean;
	export let emailLinkSignIn: boolean;
	export let toggleEmailSignIn: () => void;
	const iconsColor = 'hsl(var(--bc)/.8)';
</script>

<div class="flex justify-center gap-5 w-full h-10">
	{#if !signUp}
		<div
			class="tooltip tooltip-bottom"
			data-tip={emailLinkSignIn ? 'Sign in with email and password' : 'Sign in with email link'}
			role="button"
			tabindex="0"
			on:click={toggleEmailSignIn}
			on:keydown={toggleEmailSignIn}
		>
			{#if emailLinkSignIn}
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
		data-tip={signUp ? 'Sign up with Google' : 'Sign in with Google'}
		role="button"
		tabindex="0"
		on:click={() => goto('/auth/sign-in-with-google')}
		on:keydown={() => goto('/auth/sign-in-with-google')}
	>
		<Google style="font-size: 1.8rem; color: {iconsColor}; cursor: pointer; margin-top: .2rem" />
	</div>
</div>
