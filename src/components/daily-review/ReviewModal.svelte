<script lang="ts">
	import { onMount } from 'svelte';

	let modal: HTMLElement;

	onMount(() => {
		// Display modal on the whole screen by appending it to the body
		document.body.appendChild(modal);
	});
</script>

<div
	class="fixed flex flex-col items-center w-screen h-screen bg-white z-10"
	bind:this={modal}
>
	<slot />
</div>
