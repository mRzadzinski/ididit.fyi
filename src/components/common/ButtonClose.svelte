<script lang="ts">
	import CloseIcon from '~icons/mingcute/close-fill';

	export let handler: () => void;
</script>

<ul class="menu min-w-fit flex p-0">
	<li class="flex items-center">
		<div class="p-0 flex justify-center items-center rounded-full cursor-default">
			<div class="dropdown dropdown-top dropdown-end rounded-full">
				<label
					class="w-10 h-10 flex items-center justify-center z-[0]"
					tabindex="-1"
					for="menu-dropdown-{'review-previous'}"
				>
					<div
						class="flex justify-center items-center"
						role="button"
						tabindex="0"
						on:click={handler}
						on:keypress={handler}
					>
						<CloseIcon style="font-size: 1.5rem;" />
					</div>
				</label>
			</div>
		</div>
	</li>
</ul>
