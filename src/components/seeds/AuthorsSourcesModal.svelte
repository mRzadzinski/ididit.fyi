<script>
	import ModalBackground from '$components/common/ModalBackground.svelte';
	import AuthorItem from './AuthorItem.svelte';
</script>

<ModalBackground>
	<div
		class="flex flex-col w-[46rem] h-[30.3rem] py-[1.07rem] px-[1.57rem] rounded-2xl bg-white border-[3px] border-[var(--main)]"
	>
		<div role="tablist" class="tabs tabs-lifted">
			<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Authors" checked />
			<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Sources" />
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
				<div>Brzechwa</div>
				<div>Cyprian Norwid</div>
				<div>Dawid JEan</div>
				<div>Eiffen</div>
				<div>Franz</div>
				<div>Grzegorz</div>
				<AuthorItem author="Adam" />
				<div>Aniela</div>
				<div>Buchman</div>
				<div>Tkarczuk</div>
				<div>Jobs</div>
				<div>Tuwim</div>
				<div>Slavoy</div>
				<div>Zaz Reno</div>
				<div>Neo</div>
				<div>Trinity</div>
				<div>Exodus</div>
				<div>Bob Marley</div>
				<div>Angelina Jolie</div>
				<div>Brad Pitt</div>
			</div>
		</div>
	</div>
</ModalBackground>