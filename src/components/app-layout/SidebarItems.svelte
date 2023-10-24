<script>
	import { goto } from '$app/navigation';

	const sidebarListStyles = 'h-6 mb-6 text-base font-normal';
</script>

<button class="btn btn-warning mt-3 mb-6" on:click={() => goto('/app')}>Daily Review</button>
<li class="{sidebarListStyles} "><a href="/app/seeds">Seeds</a></li>
<li class={sidebarListStyles}><a href="/app/goals">Goals</a></li>
