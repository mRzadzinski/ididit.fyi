<script lang="ts">
	import { onMount } from 'svelte';

	let modal: HTMLElement;

	onMount(() => {
		// Display modal on the whole screen by appending it to the body
		document.body.appendChild(modal);
	});
</script>

<div
	class="fixed flex justify-center items-center w-screen h-screen bg-gray-500/60 z-10"
	bind:this={modal}
>
	<slot />
</div>
