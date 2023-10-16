<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/authStores';

	$: if ($user) {
		goto('/app');
	}
</script>

<main class="prose flex h-screen w-screen justify-center items-center flex-col max-w-none p-4">
	<div>
		<h1>Check your email</h1>
		<h4>Link usually arrives immediately, but it may take several minutes.</h4>
	</div>
</main>
