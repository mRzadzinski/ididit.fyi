<script lang="ts">
	import ToggleDot from '$components/common/ToggleDot.svelte';
	import { onMount } from 'svelte';
	import { SeedFactory, createSeed, editSeed } from '../../routes/app/seeds/[deck_id]/seedsLogic';
	import { cloneDeep } from 'lodash';
	import ModalBackground from '$components/common/ModalBackground.svelte';

	export let seedCreator = false;
	export let seed: null | SeedType;
	export let deck: SeedsDeckType;
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
	<div class="w-[40rem] h-[24rem] p-5 bg-[#FFCD4C] rounded-2xl">
		<form
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
			<div class="w-full">
				<label class="form-control">
					<div class="label pt-0">
						<span class="label-text text-xs">Content</span>
					</div>
					<textarea
						class="textarea textarea-bordered h-40 rounded-lg border-gray-500 resize-none"
						placeholder="New seed..."
						required
						bind:this={contentHtml}
						bind:value={content}
					/>
				</label>
			</div>
			<div class="flex mt-4">
				<div class="flex flex-col gap-[0.7rem] w-2/3">
					<label class="form-control w-full max-w-xs">
						<div class="label py-1">
							<span class="label-text text-xs">Author</span>
						</div>
						<input
							class="input input-xs input-bordered w-full max-w-xs rounded-lg border-gray-500"
							id="author-input"
							autocomplete="off"
							type="text"
							placeholder="Author"
							bind:value={author}
						/>
					</label>
					<label class="form-control w-full max-w-xs">
						<div class="label py-1">
							<span class="label-text text-xs">Source</span>
						</div>
						<input
							class="input input-xs input-bordered w-full max-w-xs rounded-lg border-gray-500"
							id="source-input"
							autocomplete="off"
							type="text"
							placeholder="Source"
							bind:value={source}
						/>
					</label>
					<div
						class="flex items-center gap-[0.68rem] w-52 mt-1 cursor-pointer"
						role="button"
						tabindex="0"
						on:click={() => toggleShowEveryday()}
						on:keydown={() => toggleShowEveryday()}
					>
						<div>
							<ToggleDot enabled={showEveryday} bright={true} clickHandler={toggleShowEveryday} />
						</div>
						<span class="text-xs">Show every day in Daily Review</span>
					</div>
				</div>
				<div class="flex justify-end items-end gap-2 w-1/3 -mb-3">
					<button class="btn btn-sm bg-white" type="reset" on:click={hideModal}>Cancel</button>
					{#if allowSave}
						<button class="btn btn-sm btn-neutral bg-black">Save</button>
					{:else}
						<button class="btn btn-sm btn-disabled" tabindex="-1" aria-disabled="true">Save</button>
					{/if}
				</div>
			</div>
		</form>
	</div>
</ModalBackground>

<style>
	.btn {
		width: 5.5rem;
		font-size: small;
	}
</style>
