<script>
	import { user } from '$lib/stores/authStores';
	import { goto } from '$app/navigation';

	$: if ($user === null) {
		goto('/auth/login');
	}
</script>

{#if $user}
	<slot />
{/if}
