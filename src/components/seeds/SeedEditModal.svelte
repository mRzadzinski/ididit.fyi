<script lang="ts">
	import ToggleDot from '$components/common/ToggleDot.svelte';
	import { onMount } from 'svelte';
	import { SeedFactory, createSeed, editSeed } from '../../lib/app-logic/seedsLogic';
	import { cloneDeep } from 'lodash';
	import ModalBackground from '$components/common/ModalBackground.svelte';

	export let seedCreator = false;
	export let seed: null | SeedType;
	export let deck: DeckType;
	export let hideModal: () => void;

	let allowSave = false;
	let contentHtml: HTMLElement;
	let content = '';
	let author = '';
	let source = '';
	let showEveryday = false;

	$: {
		showEveryday;
		checkIfAllowSave();
	}

	if (!seedCreator) {
		if (
			seed?.content !== undefined &&
			seed?.author !== undefined &&
			seed?.source !== undefined &&
			seed?.showEveryday !== undefined
		) {
			content = seed?.content;
			author = seed?.author;
			source = seed?.source;
			showEveryday = seed?.showEveryday;
		}
	}

	function checkIfAllowSave() {
		const contentTrimmed = cloneDeep(content).trim();
		const authorTrimmed = cloneDeep(author).trim();
		const sourceTrimmed = cloneDeep(source).trim();

		if (seedCreator && contentTrimmed.length > 0) {
			allowSave = true;
		} else if (
			!seedCreator &&
			contentTrimmed.length > 0 &&
			(contentTrimmed !== seed?.content ||
				authorTrimmed !== seed.author ||
				sourceTrimmed !== seed.source ||
				showEveryday !== seed.showEveryday)
		) {
			allowSave = true;
		} else {
			allowSave = false;
		}
	}

	function trimSeedData() {
		content = content.trim();
		author = author.trim();
		source = source.trim();
	}

	function toggleShowEveryday() {
		if (!showEveryday) {
			showEveryday = true;
		} else {
			showEveryday = false;
		}
	}

	onMount(() => {
		setTimeout(() => {
			contentHtml.focus();
		}, 0);
	});
</script>

<ModalBackground>
	<div
		class="max-w-[46.875rem] min-w-[305px] w-full min-h-[30.625rem] pt-[0.9rem] pl-[1.81rem] bg-[var(--main)] rounded-2xl"
	>
		<form
			class="flex flex-col h-full"
			on:input={() => checkIfAllowSave()}
			on:submit|preventDefault={() => {
				trimSeedData();
				if (seedCreator) {
					const newSeed = SeedFactory(content, author, source, showEveryday);
					createSeed(newSeed, deck);
					hideModal();
				} else {
					if (seed) {
						const editedSeed = { ...seed, content, author, source, showEveryday };
						editSeed(editedSeed, deck.id);
						hideModal();
					}
				}
			}}
		>
			<div class="w-full pr-[1.94rem]">
				<label class="form-control">
					<div class="label pt-0 pb-1">
						<span class="label-text text-sm">Content</span>
					</div>
					<textarea
						class="textarea textarea-bordered w-full min-h-[15.625rem] rounded-lg border-gray-500 resize-none"
						placeholder="New seed..."
						required
						bind:this={contentHtml}
						bind:value={content}
					/>
				</label>
			</div>
			<div class="flex flex-col sm:flex-row grow">
				<div class="flex flex-col grow pr-[1.94rem] sm:pr-0">
					<label class="form-control w-full max-w-xs mt-[0.81rem]">
						<div class="label pt-[0.81] pb-1">
							<span class="label-text text-sm">Author</span>
						</div>
						<input
							class="input input-sm input-bordered w-full max-w-xs rounded-lg border-gray-500"
							id="author-input"
							autocomplete="off"
							type="text"
							placeholder="Author"
							bind:value={author}
						/>
					</label>
					<label class="form-control w-full max-w-xs mt-[0.81rem]">
						<div class="label pt-[0.81] pb-1">
							<span class="label-text text-sm">Source</span>
						</div>
						<input
							class="input input-sm input-bordered w-full max-w-xs rounded-lg border-gray-500"
							id="source-input"
							autocomplete="off"
							type="text"
							placeholder="Source"
							bind:value={source}
						/>
					</label>
					<div
						class="flex items-center gap-[0.68rem] w-64 mt-[0.94rem] cursor-pointer"
						role="button"
						tabindex="0"
						on:click={() => toggleShowEveryday()}
						on:keydown={() => toggleShowEveryday()}
					>
						<div class="scale-105">
							<ToggleDot enabled={showEveryday} bright={true} clickHandler={toggleShowEveryday} />
						</div>
						<span class="text-sm">Show every day in Daily Review</span>
					</div>
				</div>
				<div class="flex justify-end items-end gap-2 w-full sm:w-[45%] mb-3 pr-4 mt-4 sm:mt-0">
					<button class="btn btn-sm bg-white" type="reset" on:click|stopPropagation={hideModal}
						>Cancel</button
					>
					{#if allowSave}
						<button class="btn btn-sm btn-neutral bg-black" type="submit">Save</button>
					{:else}
						<button class="btn btn-sm btn-disabled" tabindex="-1" aria-disabled="true">Save</button>
					{/if}
				</div>
			</div>
		</form>
	</div>
</ModalBackground>

<style>
	.label {
		padding-top: 0;
	}
	.btn-sm {
		width: 5.5rem;
		font-size: 0.75rem;
	}

	.input-sm {
		width: 100%;
	}

	.input-sm,
	.btn-sm {
		height: 1.875rem;
		min-height: 1.875rem;
	}

	.max-w-xs {
		max-width: 25rem;
	}
</style>
