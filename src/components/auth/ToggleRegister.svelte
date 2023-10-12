<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginError, registerError } from '$lib/stores/authStores';

	export let register: boolean;
</script>

<span class="mt-1 w-full">
	<button
		class="btn btn-md btn-link p-0 no-underline label-text no-animation normal-case opacity-90 font-medium"
		on:click={() => {
			if (register) {
				registerError.set('');
				goto('/auth/login');
			} else {
				loginError.set('');
				goto('/auth/register');
			}
		}}
	>
		{register ? 'Login' : 'Register'}
	</button>
</span>
