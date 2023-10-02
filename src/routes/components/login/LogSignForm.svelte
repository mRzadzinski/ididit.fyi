<script lang="ts">
	export let signUp: boolean;
</script>

<div class="form-control">
	<h1>
		{signUp ? 'Sign up' : 'Login'}
	</h1>
	<label for="email-input" class="label">
		<span class="label-text">Email</span>
	</label>
	<input id="email-input" type="text" placeholder="email" class="input input-bordered" />
</div>
<div class="form-control">
	<label for="password-input" class="label">
		<span class="label-text">Password</span>
	</label>
	<input id="password-input" type="text" placeholder="password" class="input input-bordered" />

	<span class="w-full mt-2">
		<button
			class="btn btn-xs btn-link p-0 no-underline label-text no-animation normal-case opacity-90 font-medium"
			class:invisible={signUp}
		>
			Forgot password?
		</button>
	</span>
</div>
<div class="form-control mt-6">
	<button class="btn btn-primary w-36">
		{signUp ? 'Sign up' : 'Login'}
	</button>
</div>
