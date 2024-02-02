<script lang="ts">
	import { searchPhrase } from '$lib/stores/helperStores';
	import { onMount } from 'svelte';

	export let collapseInput: Function;

	let input: HTMLInputElement;

	// To trigger width transition animation
	onMount(() => {
		input.focus();
		input.style.maxWidth = '0';
		setTimeout(() => {
			input.style.maxWidth = '20rem';
		}, 0);
	});
</script>

<input
	bind:this={input}
	on:input={() => searchPhrase.set(input.value)}
	on:focusout={() => {
		// Handle transition animation
		input.style.maxWidth = '0';
		input.style.opacity = '0';
		setTimeout(() => {
			searchPhrase.set('');
			collapseInput();
		}, 300);
	}}
	type="text"
	placeholder="Find..."
	class="input input-bordered input-xs max-h-5 mb-[0.2rem] custom-transition focus:outline-none"
/>

<style>
	.custom-transition {
		transition: all 350ms ease-out;
	}
</style>
