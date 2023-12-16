<script lang="ts">
	export let deleteHandler: () => void;
	export let hideModal: () => void;

	let inputValue: string;
</script>

<div class="flex flex-col justify-between w-80 h-60 p-4 bg-white">
	<div>
		<div class="text-lg font-bold mb-1">Delete deck</div>
		Seeds inside will be deleted.
	</div>

	<label class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">Type 'yes' to confirm</span>
		</div>
		<input
			type="text"
			placeholder=""
			class="input input-sm input-bordered"
			bind:value={inputValue}
		/>
		<div class="label" />
	</label>

	<div class="flex justify-end gap-1">
		<button class="btn btn-sm" on:click={hideModal}>Cancel</button>
		{#if inputValue && inputValue.toLowerCase() === 'yes'}
			<button class="btn btn-sm" on:click={deleteHandler}>Delete</button>
		{:else}
			<button class="btn btn-sm btn-disabled" tabindex="-1" aria-disabled="true">Delete</button>
		{/if}
	</div>
</div>
