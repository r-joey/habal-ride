<script>
	const { onSignUp }= $props();
	import { signIn } from '$lib/pocketbase.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let loading = $state(false); 
	let email = $state("");
	let password = $state("");

	async function handleSubmit(e) {
		e.preventDefault();
		console.log({ email, password });
		if (!email || !password) {
			toast.error('Please enter email and password');
			return;
		}
		const { success, message } = await signIn(email, password, 'drivers');  
		if (success) { 
			
			toast.success(message);
		} else {
			toast.error(message);
		}
	}
</script>

<div class="space-y-4 p-4">
	<div class="text-center">
		<h2 class="text-xl sm:text-2xl font-bold">Welcome Back Driver</h2>
		<p class="text-sm sm:text-base text-gray-600 mt-2">Sign to you account & start accepting rides</p>
	</div>

	<form class="space-y-4" onsubmit={handleSubmit}>
		<div >
			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Email</span> 
				</div>
				<input bind:value={email} type="email" placeholder="Please enter you email" class="input input-bordered w-full max-w-xs" /> 
			</label>
	
			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Password</span> 
				</div>
				<input bind:value={password} type="password" placeholder="Please enter you password" class="input input-bordered w-full max-w-xs" /> 
			</label>
		</div>

		<button type="submit" class="w-full btn btn-primary">Sign In</button>
	</form>

	<p class="text-center text-sm sm:text-base text-gray-600">
		Don't have an account?
		<a href="/d/signup"  class="btn btn-ghost btn-link text-black">Sign Up</a>
	</p>
</div>
