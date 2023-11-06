<script lang="ts">
	export let name: string;
	export let dailyLimit: number;
	export let order: number;
</script>

<div class="absolute mb-6 w-full" data-order={order}>
	<button class="btn-ghost flex items-center justify-between w-full bg-base-200 p-2 rounded-xl">
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
