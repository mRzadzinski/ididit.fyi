<script lang="ts">
	import Google from '~icons/bi/google';
	import Apple from '~icons/bi/apple';
	import Email from '~icons/mi/email';
	import Password from '~icons/ic/baseline-lock';
	import { signInWithGoogle } from '$lib/firebase/auth/googleAuth';
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
				<Email style="font-size: 2.3rem; color: {iconsColor}; cursor: pointer;" />
			{/if}
		</div>
	{/if}
	<div
		class="tooltip tooltip-bottom"
		data-tip={signUp ? 'Sign up with Apple' : 'Sign in with Apple'}
		role="button"
		tabindex="0"
		on:click={() => {}}
		on:keydown={() => {}}
	>
		<Apple
			style="font-size: 2.1rem; color: {iconsColor}; margin-top: -.2rem; cursor: pointer; opacity: .8"
		/>
	</div>
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
