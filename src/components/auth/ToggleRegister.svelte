<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginError, registerError } from '$lib/stores/authStores';

	export let register: boolean;
</script>

<span class="mt-4 w-full">
	<button
		on:click={() => {
			if (register) {
				registerError.set('');
				goto('/auth/login');
			} else {
				loginError.set('');
				goto('/auth/register');
			}
		}}
		class="btn btn-xs btn-link p-0 no-underline label-text no-animation normal-case opacity-90 font-medium"
	>
		{register ? 'Login' : 'Register'}
	</button>
</span>
