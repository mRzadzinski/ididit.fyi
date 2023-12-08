<script>
	import ToggleDot from '$components/common/ToggleDot.svelte';
</script>

<div class="w-[38rem] h-[24rem] p-5 bg-[#FFCD4C] rounded-2xl">
	<div class="w-full">
		<label class="form-control">
			<div class="label pt-0">
				<span class="label-text text-xs">Content</span>
			</div>
			<textarea
				class="textarea textarea-bordered h-40 rounded-lg border-gray-500 resize-none"
				placeholder="New seed..."
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
					type="text"
					placeholder="Author"
					class="input input-xs input-bordered w-full max-w-xs rounded-lg border-gray-500"
				/>
			</label>
			<label class="form-control w-full max-w-xs">
				<div class="label py-1">
					<span class="label-text text-xs">Source</span>
				</div>
				<input
					type="text"
					placeholder="Source"
					class="input input-xs input-bordered w-full max-w-xs rounded-lg border-gray-500"
				/>
			</label>

			<div class="flex items-center gap-[0.68rem] mt-1">
				<ToggleDot showEveryday={true} bright={true} />
				<span class="text-xs">Show every day in Daily Review</span>
			</div>
		</div>
		<div class="flex justify-end items-end w-1/3">
			<button class="btn">Cancel</button>
			<button class="btn">Save</button>
		</div>
	</div>
</div>
