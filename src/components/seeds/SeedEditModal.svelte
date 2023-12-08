<script lang="ts">
	import ToggleDot from '$components/common/ToggleDot.svelte';

	export let hideModal: () => void;

	let content = '';
	let author = '';
	let source = '';
	let showEveryday = false;

	function toggleShowEveryday() {
		if (!showEveryday) {
			showEveryday = true;
		} else {
			showEveryday = false;
		}
	}
</script>

<div class="w-[40rem] h-[24rem] p-5 bg-[#FFCD4C] rounded-2xl">
	<div class="w-full">
		<label class="form-control">
			<div class="label pt-0">
				<span class="label-text text-xs">Content</span>
			</div>
			<textarea
				class="textarea textarea-bordered h-40 rounded-lg border-gray-500 resize-none"
				placeholder="New seed..."
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
					type="text"
					placeholder="Source"
					bind:value={source}
				/>
			</label>

			<div class="flex items-center gap-[0.68rem] mt-1">
				<div>
					<ToggleDot enabled={showEveryday} bright={true} clickHandler={toggleShowEveryday} />
				</div>
				<span class="text-xs">Show every day in Daily Review</span>
			</div>
		</div>
		<div class="flex justify-end items-end gap-2 w-1/3 -mb-3">
			<button class="btn btn-sm w-20 text-sm bg-white" on:click={hideModal}>Cancel</button>
			<button
				class="btn btn-sm -mr-1 w-20 text-sm bg-black text-[#FFCD4C] border-none hover:bg-gray-700 active:bg-bg-gray-700"
				>Save</button
			>
		</div>
	</div>
</div>
