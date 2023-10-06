<script lang="ts">
	import Google from '~icons/bi/google';
	import Apple from '~icons/bi/apple';
	import Email from '~icons/mi/email';
	import Password from '~icons/ic/baseline-lock';

	export let signUp: boolean;
	export let passwordLogin: boolean;
	export let toggleEmailLogin: () => void;
	const iconsColor = 'hsl(var(--bc)/.8)';
</script>

<div class="flex justify-center gap-5 w-full h-10">
	{#if !signUp}
		<div
			class="tooltip tooltip-bottom"
			data-tip={passwordLogin ? 'Login with email and password' : 'Login with email link'}
			role="button"
			tabindex="0"
			on:click={toggleEmailLogin}
			on:keydown={toggleEmailLogin}
		>
			{#if passwordLogin}
				<Password
					style="font-size: 2.3rem; color: {iconsColor}; cursor: pointer; margin-top: -.15rem"
				/>
			{:else}
				<Email style="font-size: 2.3rem; color: {iconsColor}; cursor: pointer;" />
			{/if}
		</div>
	{/if}
	<div class="tooltip tooltip-bottom" data-tip={signUp ? 'Sign up with Apple' : 'Login with Apple'}>
		<Apple
			style="font-size: 2.1rem; color: {iconsColor}; margin-top: -.2rem; cursor: pointer; opacity: .8"
		/>
	</div>
	<div
		class="tooltip tooltip-bottom"
		data-tip={signUp ? 'Sign up with Google' : 'Login with Google'}
	>
		<Google style="font-size: 1.8rem; color: {iconsColor}; cursor: pointer; margin-top: .2rem" />
	</div>
</div>
