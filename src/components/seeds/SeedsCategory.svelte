<script lang="ts">
	export let name: string;
	export let dailyLimit: number;
	export let order: number;
</script>

<div class="absolute mb-6 w-full z-0" data-order={order}>
	<button class="btn h-auto flex items-center justify-between w-full p-2 rounded-xl font-normal normal-case">
		<div>
			<span class="mr-8 ml-3">{name}</span>
			<span>limit: {dailyLimit}</span>
		</div>
		<div>
			<button class="btn">Edit</button>
			<button class="btn">Delete</button>
		</div>
	</button>
</div>