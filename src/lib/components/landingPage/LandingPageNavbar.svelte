<script>
	import { Menu, X } from "lucide-svelte";
	import { slide } from "svelte/transition";

	// Mobile menu state
	let isMenuOpen = $state(false);
</script>

<nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<div class="flex-shrink-0">
				<span class="text-2xl font-bold">Habal-Ride</span>
			</div>

			<!-- Desktop menu -->
			<div class="hidden md:flex items-center space-x-8">
				<a href="#features" class="text-gray-900 hover:text-gray-600">Features</a>
				<a href="#pricing" class="text-gray-900 hover:text-gray-600">Pricing</a>
				<a href="#about" class="text-gray-900 hover:text-gray-600">About</a>
				<button class="px-4 py-2 rounded-sm bg-black text-white hover:bg-gray-800">Get Started</button>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button onclick={() => (isMenuOpen = !isMenuOpen)} class="p-2">
					{#if isMenuOpen}
						<X size={24} />
					{:else}
						<Menu size={24} />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if isMenuOpen}
		<div class="md:hidden" transition:slide>
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				<a href="#features" class="block px-3 py-2 text-gray-900 hover:text-gray-600">Features</a>
				<a href="#pricing" class="block px-3 py-2 text-gray-900 hover:text-gray-600">Pricing</a>
				<a href="#about" class="block px-3 py-2 text-gray-900 hover:text-gray-600">About</a>
				<button class="w-full mt-4 px-4 py-2 rounded-sm bg-black text-white hover:bg-gray-800">Get Started</button>
			</div>
		</div>
	{/if}
</nav>
