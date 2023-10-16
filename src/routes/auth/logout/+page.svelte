<script>
	import { goto } from '$app/navigation';
	import { logout } from '$lib/firebase/auth/logout';

	logout();
	goto('/auth/login');
</script>
