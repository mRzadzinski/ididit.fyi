<main class="flex w-full h-screen justify-center items-center flex-col">
	<div class="prose prose-sm card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
		<div class="card-body min-w-[320px] h-[35rem] rounded-2xl">
			<slot />
		</div>
	</div>
</main>

<style>
	.card-body {
		gap: 0;
		background-color: white;
	}
</style>
