<script lang="ts">
	export let enabled: boolean;
	export let bright = false;
	export let clickHandler: () => void;
</script>

<div
	class="flex justify-center items-center w-4 h-4 rounded-full transition-all duration-200 cursor-pointer
	{enabled ? 'visible' : ''}"
	class:ring-bright={bright}
	class:ring-dark={enabled && !bright}
	role="button"
	tabindex="0"
	on:click={() => {
		clickHandler();
	}}
	on:keydown={() => {
		clickHandler();
	}}
>
	<div
		class="w-2 h-2 rounded-full bg-inherit transition-all duration-200"
		class:checked-no-options={enabled && !bright}
		class:checked-with-options={enabled && bright}
	/>
</div>

<style>
	.ring-bright {
		border: solid 2px white;
		background-color: none;
	}
	.ring-dark {
		border: solid 2px #ffcd4c;
		background-color: none;
	}

	.checked-with-options {
		background-color: white;
	}

	.checked-no-options {
		background-color: #ffcd4c;
	}
</style>
