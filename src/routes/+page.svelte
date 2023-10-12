<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<main class="flex h-screen justify-center items-center flex-col">
	<h1 class="text-5xl mb-3">ididit.fyi</h1>
	<button on:click={() => goto('/app')} class="btn">Go to App</button>
</main>
