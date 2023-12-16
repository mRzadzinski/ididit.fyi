<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let deck: SeedsDeckType;
	export let editMode: boolean;
	export let getDndItem: (dndItem: HTMLElement) => void;

	let dndItem: HTMLElement;

	onMount(() => {
		getDndItem(dndItem);
	});
</script>

<div
	class="absolute mb-3 w-full z-0 {editMode ? 'h-24 cursor-default' : ''}"
	data-order={deck.order}
	data-edit-mode={editMode}
	id={deck.id}
	bind:this={dndItem}
	role="button"
	tabindex="0"
	on:click={() => {
		if (!editMode) goto(`/app/seeds/${deck.name}_Seeds_${deck.id}`);
	}}
	on:keypress={() => {
		if (!editMode) goto(`/app/seeds/${deck.id}`);
	}}
>
	<slot />
</div>
