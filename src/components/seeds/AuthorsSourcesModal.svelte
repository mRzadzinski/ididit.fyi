<script lang="ts">
	import ModalBackground from '$components/common/ModalBackground.svelte';
	import AuthorItem from './AuthorItem.svelte';

	export let closeModal: Function;

	let container: HTMLElement;
</script>

<ModalBackground>
	<div
		class="flex flex-col w-[46rem] h-[30.3rem] py-[1.07rem] px-[1.57rem] rounded-2xl bg-white border-[3px] border-[var(--main)]"
		bind:this={container}
	>
		<div class="flex">
			<div role="tablist" class="grow tabs tabs-lifted">
				<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Authors" checked />
				<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Sources" />
			</div>
			<button class="btn btn-sm" on:click={() => closeModal()}>Close</button>
		</div>
		<div class="flex flex-col gap-4 grow justify-center w-full mt-7">
			<div class="w-1/2">
				<input
					type="text"
					placeholder="Author"
					class="input input-bordered input-sm w-full h-[1.875rem] rounded-lg"
				/>
			</div>
			<div class="flex flex-col w-1/2 h-[21.25rem] pr-[0.625rem] overflow-y-auto">
				<AuthorItem {container} author="Brzechwa" />
				<AuthorItem {container} author="Cyprian Norwid" />
				<AuthorItem {container} author="Dawid Jean" />
				<AuthorItem {container} author="Eiffen" />
				<AuthorItem {container} author="Franz" />
				<AuthorItem {container} author="Grzegorz" />
				<AuthorItem {container} author="Adam" />
				<AuthorItem {container} author="Aniela" />
				<AuthorItem {container} author="Buchman" />
				<AuthorItem {container} author="Tokarczuk" />
				<AuthorItem {container} author="Jobs" />
				<AuthorItem {container} author="Tuwim" />
				<AuthorItem {container} author="Slavoy" />
				<AuthorItem {container} author="Zaz Reno" />
				<AuthorItem {container} author="Neo" />
				<AuthorItem {container} author="Trinity" />
				<AuthorItem {container} author="Exodus" />
				<AuthorItem {container} author="Bob Marley" />
				<AuthorItem {container} author="Jolie" />
				<AuthorItem {container} author="Brad Pitt" />
			</div>
		</div>
	</div>
</ModalBackground>
