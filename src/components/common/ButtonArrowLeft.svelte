<script lang="ts">
	import ArrowLeft from '~icons/bxs/left-arrow';

	export let handler: () => void;
</script>

<ul class="menu min-w-fit flex p-0">
	<li class="flex items-center">
		<div
			class="p-0 flex justify-center items-center rounded-full cursor-default"
			role="button"
			tabindex="0"
			on:click={handler}
			on:keypress={handler}
		>
			<div class="dropdown dropdown-top dropdown-end rounded-full">
				<label class="w-10 h-10 flex items-center justify-center z-[0]" for="ArrowLeft">
					<div class="flex justify-center items-center">
						<ArrowLeft style="font-size: 1.5rem; margin-right: 0.26rem;" />
					</div>
				</label>
			</div>
		</div>
	</li>
</ul>
