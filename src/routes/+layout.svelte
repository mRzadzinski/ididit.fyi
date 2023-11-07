<script lang="ts">
	// Import to initialize Firebase
	import { firebaseApp } from '$lib/firebase/firebase';
	import { subscription } from '$lib/stores/dbStores';
	import { user } from '$lib/stores/authStores';
	import '../app.css';

	let showLoading: boolean;
	$: if ($user === undefined) {
		showLoading = true;
	} else if ($user && !$subscription) {
		showLoading = true;
	} else {
		showLoading = false;
	}
</script>

{#if showLoading}
	<div class="w-screen h-screen flex justify-center items-center flex-col gap-3 text-xl">
		<div>
			<h1>ididit.fyi</h1>
		</div>
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else}
	<slot />
{/if}
