<script lang="ts" context="module">
	export interface ThreeDotsDropdownOptions {
		name: string;
		handler: Function;
	}
</script>

<script lang="ts">
	import VerticalDots from '~icons/heroicons-outline/dots-vertical';

	export let scale = 1;
	export let itemId: string;
	export let options: ThreeDotsDropdownOptions[];
	export let container: HTMLElement | null = null;

	let dropdownHTML: HTMLElement;
	let dropdownTopPosition = true;
	let btnRadius = Math.round(scale * 1.75 * 100) / 100;


	function calcDistFromEdge() {
		const dropdownHeight = dropdownHTML.offsetHeight;
		const dropdownBottom = dropdownHTML.getBoundingClientRect().bottom;
		const viewportHeight = window.innerHeight;
		let containerEdge = container ? container.getBoundingClientRect().bottom : viewportHeight;

		if (dropdownTopPosition && containerEdge - dropdownBottom - dropdownHeight < 35) {
			dropdownTopPosition = true;
		} else {
			dropdownTopPosition = false;
		}
	}
</script>

<!-- Stop propagation to avoid triggering parent's click handler -->
<div
	class="flex items-center"
	role="button"
	tabindex="0"
	on:click={(e) => e.stopPropagation()}
	on:keypress={(e) => e.stopPropagation()}
>
	<ul class="menu min-w-fit flex p-0">
		<li class="flex items-center">
			<div
				class="p-0 flex justify-center items-center rounded-full w-7 h-7"
				style="width: {scale !== 1 ? btnRadius : null}rem; height: {scale !== 1 ? btnRadius : null}rem;"
				id="menu-dropdown-{itemId}"
			>
				<div
					class="dropdown dropdown-end w-full h-full rounded-full
				{dropdownTopPosition ? 'dropdown-top' : ''}"
				>
					<label
						class="w-full h-full flex items-center justify-center z-[0]"
						tabindex="-1"
						for="menu-dropdown-{itemId}"
						on:mouseenter={() => {
							calcDistFromEdge();
						}}
					>
						<div>
							<VerticalDots style="font-size: {0.85 * scale}rem; color: white" />
						</div>
					</label>
					<ul
						class="dropdown-content menu p-2 shadow bg-white rounded-box w-28"
						bind:this={dropdownHTML}
					>
						{#each options as option (option.name)}
							<li>
								<div
									role="button"
									tabindex="0"
									on:click={(e) => {
										e.stopPropagation();
										option.handler();
									}}
									on:keydown={(e) => {
										e.stopPropagation();
										option.handler();
									}}
								>
									{option.name}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</li>
	</ul>
</div>
