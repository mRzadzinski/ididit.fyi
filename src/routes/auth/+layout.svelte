<script lang="ts">
	import { user } from '$lib/stores/firebaseAuthStore';
	import { goto } from '$app/navigation';

	$: if ($user) {
		goto('/');
	}
</script>

{#if $user === null}
	<main class="flex h-screen justify-center items-center flex-col">
		<div class="prose prose-sm card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<div class="card-body">
				<slot />
			</div>
		</div>
	</main>
{/if}
