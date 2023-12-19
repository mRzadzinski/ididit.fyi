<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<main class="flex h-screen justify-center items-center flex-col">
	<h1 class="text-5xl mb-6">ididit.fyi</h1>
	<button class="btn w-36" on:click={() => goto('/app')}>Login</button>
</main>
