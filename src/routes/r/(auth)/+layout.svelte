<script> 
	const { children }= $props();
</script>

  
<main class="container mx-auto pt-6 px-6 max-w-md  m-4">
	<div class="text-center mb-8 ">
		<a href="/" class="text-2xl sm:text-3xl font-bold mb-2">Habal-Ride</a>
		<p class="text-sm sm:text-base text-gray-600">Your trusted ride-hailing service</p>
	</div>
	<div class="border border-gray-300 rounded-sm p-4"> 
		{@render children()}
	</div>
</main> 