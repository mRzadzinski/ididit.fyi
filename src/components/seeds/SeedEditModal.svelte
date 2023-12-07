<script lang="ts">
	import { onMount } from 'svelte';

	let modal: HTMLElement;

	onMount(() => {
		// Display modal on the whole screen by appending it to the body
		document.body.appendChild(modal);
	});
</script>

<div
	class="fixed flex justify-center items-center w-screen h-screen bg-gray-500/60 z-10"
	bind:this={modal}
>
	<div class="w-[36rem] h-[24rem] bg-[#FFCD4C] rounded-2xl">
		<div class="w-full">
			<div>Content</div>
			<textarea name="" id="" cols="30" rows="10" />
		</div>
		<div class="flex w-full">
			<div>
				<div>
					<div>Author</div>
					<input type="text" />
				</div>
				<div>
					<div>Source</div>
					<input type="text" />
				</div>
				<div><span>Show every day in Daily Review</span></div>
			</div>
			<div>
				<button class="btn">Cancel</button>
				<button class="btn">Save</button>
			</div>
		</div>
	</div>
</div>
