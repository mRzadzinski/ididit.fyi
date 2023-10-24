<script>
	import { logout } from '$lib/firebase/auth/logout';
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<li><a>Settings</a></li>
<!-- svelte-ignore a11y-missing-attribute -->
<li>
	<a role="button" tabindex="0" on:click={() => logout()} on:keydown={() => logout()}>Log Out</a>
</li>
