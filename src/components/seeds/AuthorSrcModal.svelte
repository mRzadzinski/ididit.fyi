<script lang="ts">
	import ModalBackground from '$components/common/ModalBackground.svelte';
	import AuthorItem from './AuthorSrcItem.svelte';
	import SearchIcon from '~icons/material-symbols/search';

	export let closeModal: Function;

	let container: HTMLElement;
</script>

<ModalBackground>
	<div
		class="flex flex-col w-[46rem] h-[30.3rem] py-[1.07rem] px-[1.57rem] rounded-2xl bg-white border-[3px] border-[var(--main)]"
		bind:this={container}
	>
		<div class="flex pl-[0.6rem]">
			<div role="tablist" class="grow tabs tabs-lifted">
				<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Authors" checked />
				<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Sources" />
			</div>
			<button class="btn btn-sm" on:click={() => closeModal()}>×</button>
		</div>
		<div class="flex gap-4 grow justify-center w-full mt-7">
			<div class="w-1/2">
				<div class="relative pl-[0.6rem]">
					<input
						class="input input-bordered input-sm w-full mb-5 pr-10 rounded-lg"
						type="text"
						placeholder="Author"
					/>
					<div class="absolute top-[0.55rem] right-[0.8rem]">
						<SearchIcon style="font-size: 0.8rem;" />
					</div>
				</div>
				<div class="flex flex-col w-full h-[20.5rem] pr-[0.625rem] overflow-y-auto">
					<AuthorItem {container} name="Brzechwa" />
					<AuthorItem {container} name="Cyprian Norwid" />
					<AuthorItem {container} name="Dawid Jean" />
					<AuthorItem {container} name="Eiffen" />
					<AuthorItem {container} name="Franz" />
					<AuthorItem {container} name="Grzegorz" />
					<AuthorItem {container} name="Adam" />
					<AuthorItem {container} name="Aniela" />
					<AuthorItem {container} name="Buchman" />
					<AuthorItem {container} name="Tokarczuk" />
					<AuthorItem {container} name="Jobs" />
					<AuthorItem {container} name="Tuwim" />
					<AuthorItem {container} name="Slavoy" />
					<AuthorItem {container} name="Zaz Reno" />
					<AuthorItem {container} name="Neo" />
					<AuthorItem {container} name="Trinity" />
					<AuthorItem {container} name="Exodus" />
					<AuthorItem {container} name="Bob Marley" />
					<AuthorItem {container} name="Jolie" />
					<AuthorItem {container} name="Brad Pitt" />
				</div>
			</div>
			<div class="w-1/2">
				<div class="flex items-center h-8 mb-5 pl-[0.8rem] text-sm">Author's sources:</div>
				<div class="flex flex-col w-full h-[20.5rem] pr-[0.625rem] overflow-y-auto">
					<AuthorItem {container} isButton={false} name="Grzegorz" />
					<AuthorItem {container} isButton={false} name="Cyprian Norwid" />
					<AuthorItem {container} isButton={false} name="Dawid Jean" />
					<AuthorItem {container} isButton={false} name="Eiffen" />
					<AuthorItem {container} isButton={false} name="Franz" />
					<AuthorItem {container} isButton={false} name="Adam" />
					<AuthorItem {container} isButton={false} name="Aniela" />
					<AuthorItem {container} isButton={false} name="Buchman" />
					<AuthorItem {container} isButton={false} name="Tokarczuk" />
					<AuthorItem {container} isButton={false} name="Brzechwa" />
					<AuthorItem {container} isButton={false} name="Jobs" />
					<AuthorItem {container} isButton={false} name="Tuwim" />
					<AuthorItem {container} isButton={false} name="Slavoy" />
					<AuthorItem {container} isButton={false} name="Zaz Reno" />
					<AuthorItem {container} isButton={false} name="Exodus" />
					<AuthorItem {container} isButton={false} name="Neo" />
					<AuthorItem {container} isButton={false} name="Trinity" />
					<AuthorItem {container} isButton={false} name="Brad Pitt" />
					<AuthorItem {container} isButton={false} name="Bob Marley" />
					<AuthorItem {container} isButton={false} name="Jolie" />
				</div>
			</div>
		</div>
	</div>
</ModalBackground>
