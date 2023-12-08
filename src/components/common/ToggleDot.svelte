<script lang="ts">
	export let showEveryday: boolean;
	export let bright = false;
</script>

<div
	class="flex justify-center items-center w-4 h-4 rounded-full transition-all duration-200 cursor-pointer
	{showEveryday ? 'visible' : ''}"
	class:ring-bright={bright}
	class:ring-dark={showEveryday && !bright}
>
	<div
		class="w-2 h-2 rounded-full bg-inherit"
		class:checked-no-options={showEveryday && !bright}
		class:checked-with-options={showEveryday && bright}
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
