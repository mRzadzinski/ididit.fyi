<script>
	import App from './components/App.svelte';
	import Auth from './components/Auth.svelte';

	let logged = false;

	function toggleLogged() {
		logged = !logged;
	}
</script>

<main class="flex h-screen justify-center items-center flex-col">
	{#if logged}
		<App />
	{:else}
		<Auth />
	{/if}

	<button class="btn" on:click={toggleLogged}>
		{#if logged}
			Log out
		{:else}
			Log in
		{/if}
	</button>
</main>
