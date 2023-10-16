<script>
	import { goto } from '$app/navigation';
	import { logout } from '$lib/firebase/auth/logout';

	logout();
	goto('/auth/login');
</script>

<div class="w-screen h-screen flex justify-center items-center flex-col gap-3 text-xl">
	<div>
		<h1>ididit.fyi</h1>
	</div>
	<span class="loading loading-spinner loading-lg" />
</div>