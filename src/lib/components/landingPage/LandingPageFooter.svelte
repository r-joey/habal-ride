<script>
	import { fade } from "svelte/transition";

	// Footer links data
	const footerSections = [
		{
			title: "Company",
			links: [
				{ href: "#about", text: "About" },
				{ href: "#careers", text: "Careers" },
				{ href: "#press", text: "Press" },
			],
		},
		{
			title: "Product",
			links: [
				{ href: "#features", text: "Features" },
				{ href: "#pricing", text: "Pricing" },
				{ href: "#support", text: "Support" },
			],
		},
		{
			title: "Legal",
			links: [
				{ href: "#privacy", text: "Privacy" },
				{ href: "#terms", text: "Terms" },
				{ href: "#security", text: "Security" },
			],
		},
		{
			title: "Connect",
			links: [
				{ href: "#twitter", text: "Twitter" },
				{ href: "#facebook", text: "Facebook" },
				{ href: "#instagram", text: "Instagram" },
			],
		},
	];
</script>

<footer class="bg-black text-white py-12 px-4 sm:px-6 lg:px-8" transition:fade>
	<div class="max-w-7xl mx-auto">
		<!-- Grid layout with better mobile spacing -->
		<div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
			{#each footerSections as section}
				<div class="space-y-4">
					<h3 class="text-lg font-semibold">{section.title}</h3>
					<ul class="space-y-3">
						{#each section.links as link}
							<li>
								<a href={link.href} class="text-gray-300 hover:text-white transition-colors text-sm md:text-base">
									{link.text}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<!-- Copyright with better mobile spacing -->
		<div class="mt-12 pt-8 border-t border-gray-800 text-center">
			<p class="text-sm md:text-base text-gray-300">&copy; 2024 RideX. All rights reserved.</p>
		</div>
	</div>
</footer>
