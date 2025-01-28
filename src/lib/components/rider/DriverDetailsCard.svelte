<script>
	import { EllipsisVertical, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte";
    import { currentUser, getInitialRideOffers, pbClient, getImageUrl } from "$lib/pocketbase.svelte"
    const { driver, amount } = $props();
</script>


<div class="divider mt-4 mb-4 text-gray-500">Driver details</div>
<div class="border border-black rounded-sm p-4"> 
    <div class="flex items-start gap-4">
        <!-- Driver Image -->
        <img src={getImageUrl(driver, driver.avatar) ?? '/pfp-placeholder.jpg'} alt={driver.first_name} class="w-16 h-16 rounded-full object-cover" />

        <div class="flex-1">
            <!-- Driver Name and Rating -->
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-semibold">{driver.first_name} {driver.last_name}</h3> 
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                        <Star size={16} class="fill-gray-600 text-gray-600" />
                        <span>{driver.rating}</span>
                        <span>({driver.trips} trips)</span>
                    </div>
                </div>
                <span class="font-bold bg-black text-white px-2 py-0.5 rounded-sm">₱{amount.toFixed(2)}</span>
                
            </div>

            <!-- Vehicle Information -->
            <div class="mt-3 flex-wrap flex items-center gap-2 text-xs text-gray-600">
                <Car size={16} />
                <span>{driver?.expand?.vehicles_via_driver?.color} {driver?.expand?.vehicles_via_driver?.brand} {driver?.expand?.vehicles_via_driver?.model}</span>
                <span class="px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                    {driver?.expand?.vehicles_via_driver?.plate}
                </span>
            </div>
        </div>
    </div>
</div>