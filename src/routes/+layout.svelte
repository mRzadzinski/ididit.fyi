<script lang="ts">
	import { firebaseApp } from '$lib/firebase/firebase';
	import { user } from '$lib/stores/firebaseStores';
	import '../app.css';
</script>

{#if $user === undefined}
	<div class="w-screen h-screen flex justify-center items-center flex-col gap-3 text-xl">
		<div>
			<h1>ididit.fyi</h1>
		</div>
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else}
	<slot />
{/if}
