<script>
	import { signUp } from '$lib/pocketbase.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	
	let loading = $state(false);

	async function handleSubmit (e) {
		loading = true
		e.preventDefault();  
		const data = Object.fromEntries( await new FormData(e.target));
		const { success, message, riderData } = await signUp(data, 'drivers');
		if (success) {  
			toast.success(message);
		} {
			toast.error(message);
		}
		loading = false
	}; 
</script>

<div class="space-y-4 p-4">
	<div class="text-center">
		<h2 class="text-xl sm:text-2xl font-bold">Create Account</h2>
		<p class="text-sm sm:text-base text-gray-600 mt-2">Join Habal-Ride as a driver</p>
	</div>

	<form class="space-y-4" onsubmit={handleSubmit}>
		<div class="space-y-2">

			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">First name</span> 
				</div>
				<input name='first_name' type="text" placeholder="Please enter your first name" class="input input-bordered w-full max-w-xs" /> 
			</label>

			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Last name</span> 
				</div>
				<input name="last_name" type="text" placeholder="Please enter your last name" class="input input-bordered w-full max-w-xs" /> 
			</label>

			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Driver's License <small class="!font-thin" >(7MB or less)</small></span> 
				</div>
				<input name="drivers_license" type="file" class="file-input file-input-bordered w-full max-w-xs" /> 
			</label> 
			
			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Email</span> 
				</div>
				<input name="email" type="email" placeholder="Please enter your email" class="input input-bordered w-full max-w-xs" /> 
			</label>

			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Mobile number</span> 
				</div>
				<input name="mobile_number" type="text" placeholder="Please enter your last name" class="input input-bordered w-full max-w-xs" /> 
			</label>
	
			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Password</span> 
				</div>
				<input name="password" type="password" placeholder="Please enter your password" class="input input-bordered w-full max-w-xs" /> 
			</label>

			<label class="form-control w-full max-w-xs">
				<div class="label">
				  <span class="label-text font-semibold">Confirm Password</span> 
				</div>
				<input name="passwordConfirm" type="password" placeholder="Please confirm your password" class="input input-bordered w-full max-w-xs" /> 
			</label>

		</div>

		<div class="flex items-start sm:items-center gap-2">
			<input type="checkbox" class="checkbox checkbox-xs" required />
			<label for="terms" class="text-xs sm:text-sm text-gray-600">
				<span class="label-text text-xs">I agree to the</span>
				<button type="button" class="text-black font-semibold btn-link">terms and conditions</button>
			</label>
		</div>

		<button disabled={loading} type="submit" class="w-full btn btn-primary">
			{#if loading}
				<span class="loading loading-spinner loading-md"></span>
			{/if}
			Sign Up
		</button>
	</form>

	<p class="text-center text-sm sm:text-base text-gray-600">
		Already have an account?
		<a href="/d/signin" class="btn btn-ghost btn-link text-black">Sign In</a>
	</p>
</div>
