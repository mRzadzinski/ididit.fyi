<script lang="ts">
	import { onMount } from 'svelte';

	let modal: HTMLElement;

	onMount(() => {
		// Display modal on the whole screen by appending it to the body
		document.body.appendChild(modal);
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- Stop propagation to avoid collapsing expanded seed when in edit modal -->
<div
	class="fixed flex flex-col justify-center items-center w-screen h-screen bg-gray-500/60 z-10"
	bind:this={modal}
	on:click|stopPropagation={() => {}}
>
	<!-- Position slot on 1/3vh -->
	<div class="grow-[1]" />
	<slot />
	<div class="grow-[2]" />
</div>
