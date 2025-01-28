<script> 
	const { children }= $props(); 
	import { on } from 'svelte/events';

 
</script>

  
<main class="container mx-auto pt-6 px-4 sm:px-6 py-8 max-w-md">
	<div class="text-center mb-8">
		<h1 class="text-2xl sm:text-3xl font-bold mb-2">Habal-Ride</h1>
		<p class="text-sm sm:text-base text-gray-600">Your trusted ride-hailing service</p>
	</div>
	<div class="border border-gray-300 rounded-sm p-4"> 
		{@render children()}
	</div>
</main> 