<script lang="ts">
	import { user } from '$lib/stores/firebaseStores';
</script>

<main
	class="flex h-screen justify-center items-center flex-col"
	style:display={$user === null ? 'flex' : 'none'}
>
	<div class="prose prose-sm card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
		<div class="card-body">
			<slot />
		</div>
	</div>
</main>
