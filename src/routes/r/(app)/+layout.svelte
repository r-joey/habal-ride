<script>
    import { AppBottomNavbar, AppNavbar } from '$lib/components'
    const { children } = $props();
 
</script>

<div class="flex flex-col min-h-screen bg-white text-black pb-16">
    <AppNavbar />
    {@render children()}
    <AppBottomNavbar userType="r" />
</div>