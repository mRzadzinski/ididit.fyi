<script lang="ts">
	import ModalBackground from '$components/common/ModalBackground.svelte';
	import AuthorItem from './AuthorItem.svelte';

	export let closeModal: Function;
</script>

<ModalBackground>
	<div
		class="flex flex-col w-[46rem] h-[30.3rem] py-[1.07rem] px-[1.57rem] rounded-2xl bg-white border-[3px] border-[var(--main)]"
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
				<AuthorItem author="Brzechwa" />
				<AuthorItem author="Cyprian Norwid" />
				<AuthorItem author="Dawid Jean" />
				<AuthorItem author="Eiffen" />
				<AuthorItem author="Franz" />
				<AuthorItem author="Grzegorz" />
				<AuthorItem author="Adam" />
				<AuthorItem author="Aniela" />
				<AuthorItem author="Buchman" />
				<AuthorItem author="Tokarczuk" />
				<AuthorItem author="Jobs" />
				<AuthorItem author="Tuwim" />
				<AuthorItem author="Slavoy" />
				<AuthorItem author="Zaz Reno" />
				<AuthorItem author="Neo" />
				<AuthorItem author="Trinity" />
				<AuthorItem author="Exodus" />
				<AuthorItem author="Bob Marley" />
				<AuthorItem author="Jolie" />
				<AuthorItem author="Brad Pitt" />
			</div>
		</div>
	</div>
</ModalBackground>
