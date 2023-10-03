<script lang="ts">
	import Google from '~icons/bi/google';
	import Apple from '~icons/bi/apple';
	import Facebook from '~icons/bi/facebook';
	import Microsoft from '~icons/bi/microsoft';
</script>

<div class="flex justify-center gap-5 w-full">
	<div class="tooltip tooltip-bottom" data-tip="Apple">
		<Apple style="font-size: 2.1rem; color: #617188; margin-top: -.2rem; cursor: pointer;" />
	</div>
	<div class="tooltip tooltip-bottom" data-tip="Microsoft">
		<Microsoft style="font-size: 1.85rem; color: #617188; cursor: pointer;" />
	</div>
	<div class="tooltip tooltip-bottom" data-tip="Google">
		<Google style="font-size: 1.9rem; color: #617188; cursor: pointer;" />
	</div>
	<div class="tooltip tooltip-bottom" data-tip="Facebook">
		<Facebook style="font-size: 2rem; color: #617188; cursor: pointer; margin-top: -.1rem;" />
	</div>
</div>
