<script>
	import ModalBackground from '$components/common/ModalBackground.svelte';
</script>

<ModalBackground>
	<div
		class="w-[46rem] h-[30.3rem] py-[1.07rem] px-[1.57rem] rounded-2xl bg-white border-[3px] border-[var(--main)]"
	>
		<div role="tablist" class="tabs tabs-lifted">
			<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Authors" checked />
			<input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Sources" />
		</div>
	</div>
</ModalBackground>
