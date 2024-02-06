<script lang="ts">
	import ThreeDotsDropdown from '$components/common/ThreeDotsDropdown.svelte';
	import { afterUpdate } from 'svelte';
	import CheckMarkIcon from '~icons/material-symbols/check';
	import CancelIcon from '~icons/material-symbols/close';

	export let name: string;
	export let container: HTMLElement;
	export let isButton = true;

	let input: HTMLElement;
	let showOptions = false;
	let editMode = false;

	afterUpdate(() => {
		if (editMode) {
			input.focus();
		}
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if !editMode}
	<div
		class="flex justify-between items-center w-full min-h-[1.875rem] pl-[0.75rem] pr-1 custom-transition bg-white rounded-full hover:bg-[var(--main)]
		{isButton ? 'cursor-pointer' : 'cursor-default'}"
		on:mouseenter={() => (showOptions = true)}
		on:mouseleave={() => (showOptions = false)}
	>
		<span class="text-sm">{name}</span>
		<div class={showOptions ? '' : 'invisible'}>
			<ThreeDotsDropdown
				{container}
				scale={0.85}
				itemId="author-item"
				options={[
					{
						name: 'Edit',
						handler: () => (editMode = true)
					},
					{
						name: 'Delete',
						handler: () => {}
					}
				]}
			/>
		</div>
	</div>
{:else}
	<div class="relative">
		<input
			class="input input-bordered input-sm w-full pr-[3.3rem] rounded-lg"
			type="text"
			bind:this={input}
			bind:value={name}
		/>
		<div
			class="absolute top-0 right-0 flex justify-center items-center gap-1 w-[3.3rem] h-[1.875rem] pt-[0.11rem] cursor-default"
		>
			<div
				class="cursor-pointer"
				role="button"
				tabindex="0"
				on:click={() => (editMode = false)}
				on:keypress={() => (editMode = false)}
			>
				<CheckMarkIcon style="font-size: 0.85rem;" />
			</div>
			<div
				class="cursor-pointer"
				role="button"
				tabindex="0"
				on:click={() => (editMode = false)}
				on:keypress={() => (editMode = false)}
			>
				<CancelIcon style="font-size: 0.85rem;" />
			</div>
		</div>
	</div>
{/if}

<style>
	.custom-transition {
		transition: background-color 75ms ease-in;
	}

	.input-sm {
		outline: none;
		height: 1.875rem;
	}
</style>
