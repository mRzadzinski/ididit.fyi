<script lang="ts">
	export let enabled: boolean;
	export let bright = false;
	export let clickHandler: () => void;
</script>

<ul class="menu min-w-fit flex p-0">
	<li class="flex items-center">
		<div
			class="p-0 w-7 h-7 flex justify-center items-center rounded-full cursor-default"
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
			<div class="dropdown dropdown-top dropdown-end w-[0.875rem] h-[0.875rem] rounded-full">
				<label
					class="w-full h-full flex items-center justify-center z-[0]"
					tabindex="-1"
					for="menu-dropdown-{'toggle-dot'}"
				>
					<div
						class="flex justify-center items-center w-full h-full rounded-full
				{enabled ? 'visible' : ''}"
						class:ring-bright={bright}
						class:ring-dark={enabled && !bright}
					>
						<div
							class="w-2 h-2 rounded-full bg-inherit"
							class:checked-no-options={enabled && !bright}
							class:checked-with-options={enabled && bright}
						/>
					</div>
				</label>
			</div>
		</div>
	</li>
</ul>

<style>
	@media (hover: hover) {
		:where(.menu li:not(.menu-title):not(.disabled) > *:not(ul):not(details):not(.menu-title)):not(
				.active
			):hover,
		:where(.menu li:not(.menu-title):not(.disabled) > details > summary:not(.menu-title)):not(
				.active
			):hover {
			cursor: default;
		}
	}

	.ring-bright {
		border: solid 2px white;
		background-color: none;
	}
	.ring-dark {
		border: solid 2px none;
		background-color: none;
	}

	.checked-with-options {
		background-color: white;
	}

	.checked-no-options {
		width: 0.625rem;
		height: 0.625rem;
		background-color: var(--main);
	}
</style>
