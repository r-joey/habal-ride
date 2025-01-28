<script>
	import { MapPin, Clock, Shield } from "lucide-svelte";
	import { fade } from "svelte/transition";
</script>

<section class="pt-24 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
			<!-- Text content with better mobile spacing -->
			<div class="space-y-6 md:space-y-8 text-center lg:text-left">
				<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">Your Ride, Your Way, Right Away</h1>
				<p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">Experience seamless urban mobility with our premium ride-hailing service. Get to your destination safely and comfortably.</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<a href="/r/signin" class="btn btn-primary" transition:fade>Book a Ride</a>
					<a href="/d/signin" class="btn btn-primary btn-outline" transition:fade>Become a Driver</a>
					<!-- <button class="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-sm border-2 border-black hover:bg-gray-100 transition-colors" transition:fade>Become a Driver</button> -->
				</div>
			</div>
			<!-- Image with better mobile display -->
			<div class="relative mt-8 lg:mt-0" transition:fade>
				<img src="/Habal-Ride.png" alt="Taxi service" class="rounded-sm   w-full h-auto object-cover" loading="lazy" />
			</div>
		</div>

		<!-- Features with improved mobile layout -->
		<div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-20">
			{#each [{ icon: MapPin, title: "Easy Pickup", desc: "Book your ride with just a few taps and get picked up right where you are." }, { icon: Clock, title: "24/7 Service", desc: "Available round the clock, whenever you need a reliable ride." }, { icon: Shield, title: "Safe Rides", desc: "Your safety is our priority with verified drivers and real-time tracking." }] as feature}
				<div class="p-5 md:p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300" transition:fade>
					<svelte:component this={feature.icon} size={28} class="mb-4 text-gray-800" />
					<h3 class="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
					<p class="text-gray-600 text-sm md:text-base">{feature.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
