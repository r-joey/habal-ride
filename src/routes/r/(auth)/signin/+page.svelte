<script>
	import { signIn } from '$lib/pocketbase.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let loading = $state(false);
	let email = $state("");
	let password = $state("");

	async function handleSubmit(e) {
		e.preventDefault();
		if (!email || !password) {
			toast.error('Please enter email and password');
			return;
		}
		const { success, message } = await signIn(email, password, 'riders');  
		if (success) {
			toast.success(message);
			goto('/r/home');
		} else {
			toast.error(message);
		}
	};
</script>

<div class="space-y-6 p-4">
	<div class="text-center">
		<h2 class="text-xl sm:text-2xl font-bold">Welcome Back</h2>
		<p class="text-sm sm:text-base text-gray-600 mt-2">Sign in to continue riding with us</p>
	</div>

	<form class="space-y-4" onsubmit={handleSubmit}>
		<div >
			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Email</span> 
				</div>
				<input type="email" bind:value={email} placeholder="Please enter you email" class="input input-bordered w-full max-w-xs" /> 
			</label>
	
			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Password</span> 
				</div>
				<input type="password" bind:value={password} placeholder="Please enter you password" class="input input-bordered w-full max-w-xs" /> 
			</label>
		</div>
		<button type="submit" class="w-full btn btn-primary">Sign In</button>
	</form>

	<p class="text-center text-sm sm:text-base text-gray-600">
		Don't have an account?
		<a href="/r/signup"  class="btn btn-ghost btn-link text-black">Sign Up</a>
	</p>
</div>
