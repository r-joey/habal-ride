<script>
	import { fade } from "svelte/transition";
</script>

<section class="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
	<div class="max-w-7xl mx-auto text-center">
		<div class="space-y-6 md:space-y-8" transition:fade>
			<h2 class="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
			<p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">Join thousands of satisfied riders who trust us for their daily commute. Download our app now and experience the difference.</p>
			<div class="flex flex-col sm:flex-row justify-center gap-4 mt-8"> 
				<button class="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-sm bg-black text-white hover:bg-gray-800 transition-colors">Install now</button>
			</div>
		</div>
	</div>
</section>
