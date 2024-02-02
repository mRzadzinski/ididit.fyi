<script lang="ts">
	import SearchIcon from '~icons/material-symbols/search';

	export let clickHandler: Function;
</script>

<ul class="menu min-w-fit flex p-0 mb-[0.15rem]">
	<li class="flex items-center">
		<div
			class="p-0 flex justify-center items-center rounded-full cursor-default"
			role="button"
			tabindex="0"
			on:click={(e) => {
				e.stopImmediatePropagation();
				clickHandler();
			}}
			on:keydown={() => {
				clickHandler();
			}}
		>
			<div class="dropdown dropdown-top dropdown-end rounded-full w-5 h-5">
				<label
					class="w-full h-full flex items-center justify-center z-[0]"
					tabindex="-1"
					for="search"
				>
					<SearchIcon style="font-size: 0.75rem; margin-right: 0.05rem;" />
				</label>
			</div>
		</div>
	</li>
</ul>
