<script lang="ts" context="module">
	export interface ThreeDotsDropdownOptions {
		name: string;
		handler: Function;
	}
</script>

<script lang="ts">
	import VerticalDots from '~icons/heroicons-outline/dots-vertical';

	export let itemId: string;
	export let options: ThreeDotsDropdownOptions[];
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
				class="p-0 w-7 h-7 flex justify-center items-center rounded-full"
				id="menu-dropdown-{itemId}"
			>
				<div class="dropdown dropdown-top dropdown-end w-full h-full rounded-full">
					<label
						class="w-full h-full flex items-center justify-center z-[0]"
						tabindex="-1"
						for="menu-dropdown-{itemId}"
					>
						<VerticalDots style="font-size: 0.85rem; color: white" />
					</label>
					<ul class="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-28">
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
