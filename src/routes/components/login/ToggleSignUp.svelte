<script lang="ts">
	import { signUpError, loginError } from '$lib/stores/firebaseAuthStore';

	export let signUp: boolean;
	export let toggleSignUp: () => void;
</script>

<span class="mt-7 w-full">
	<button
		on:click={() => {
			toggleSignUp();
			signUpError.set('');
			loginError.set('');
		}}
		class="btn btn-xs btn-link p-0 no-underline label-text no-animation normal-case opacity-90 font-medium"
	>
		{signUp ? 'Go to login' : 'Need account?'}
	</button>
</span>
