<script>
	import { goto } from '$app/navigation';

	const sidebarListStyles = 'h-6 mb-6 text-base font-normal';
</script>

<button class="btn btn-warning mt-3 mb-6 bg-accent" on:click={() => goto('/app')}>Daily Review</button>
<li class={sidebarListStyles}><a href="/app/goals">Goals</a></li>
<li class="{sidebarListStyles} "><a href="/app/seeds">Seeds</a></li>
<li class="{sidebarListStyles} "><a href="/app/vision">Vision</a></li>
<li class="{sidebarListStyles} "><a href="/app/dreams">Dreams</a></li>
<li class="{sidebarListStyles} "><a href="/app/wishlist">Wishlist</a></li>
<li class="{sidebarListStyles} "><a href="/app/books">Books</a></li>
<li class="{sidebarListStyles} mt-10"><a href="/app/proud-board">Proud Board</a></li>
<li class="{sidebarListStyles} "><a href="/app/friends">Friends</a></li>
