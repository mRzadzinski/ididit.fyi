<script lang="ts">
	import { getContext } from 'svelte';
	import VerticalDots from '~icons/heroicons-outline/dots-vertical';

	export let deckId: string;
	export let dndItem: HTMLElement;
	export let handleToggleEdit: (action: string) => void;
	const { handleDeleteDeck } = getContext<{
		handleDeleteDeck: (dndItem: HTMLElement, itemId: string) => void;
	}>('handleDeleteDeck');
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
				id="menu-dropdown-{deckId}"
			>
				<div class="dropdown dropdown-top dropdown-end w-full h-full">
					<label
						class="w-full h-full flex items-center justify-center z-[0]"
						tabindex="-1"
						for="menu-dropdown-{deckId}"
					>
						<VerticalDots style="font-size: .75rem;" />
					</label>
					<ul class="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-28">
						<li>
							<div
								role="button"
								tabindex="0"
								on:click={(e) => {
									e.stopPropagation()
									handleToggleEdit('enable');
								}}
								on:keydown={(e) => {
									e.stopPropagation()
									handleToggleEdit('enable');
								}}
							>
								Edit
							</div>
						</li>
						<li>
							<div
								role="button"
								tabindex="0"
								on:click={() => handleDeleteDeck(dndItem, deckId)}
								on:keydown={() => handleDeleteDeck(dndItem, deckId)}
							>
								Delete
							</div>
						</li>
					</ul>
				</div>
			</div>
		</li>
	</ul>
</div>
