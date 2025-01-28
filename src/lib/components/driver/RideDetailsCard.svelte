<script> 
	import { Hash, PhilippinePeso, Map, SquareX, Ban, EyeOff, EllipsisVertical, Check, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte";
    import { getImageUrl } from "$lib/pocketbase.svelte";
	import { onMount } from "svelte"; 
    import { pbClient } from "$lib/pocketbase.svelte"; 
    import { ConfirmationModal } from '$lib/components'
    const { completeRideHandler, updateRide, ride } = $props()

    onMount(() => {
        console.log('subscribing to ride', ride.id) 
		pbClient.collection('rides').subscribe(ride.id, function (e) {
			console.log('ride updated: ', e) 
			switch (e.action) { 
				case 'update': 
					let tempRide = e.record
					tempRide['pickup'] = tempRide.pick_up_lat + ', ' + tempRide.pick_up_lng
					tempRide['dropoff'] = tempRide.drop_off_lat + ', ' + tempRide.drop_off_lng 
					updateRide(tempRide)
					break;
				case 'delete':
                    updateRide(null)
					break;
			}
		}, {expand: 'rider, offers_via_ride'}) 
 
    })
</script>

<div class="flex flex-col gap-4 border border-gray-300 p-4 rounded-sm bg-gray-50">
    <div class="divider text-gray-500">Ride details</div> 
    <div class="flex flex-col gap-4">
        <a href={`https://maps.google.com?q=${ride.pickup}`} target="_blank" class="w-full btn-outline btn btn-link">
            <MapPin />
            Pick up location
        </a>
        <a href={`https://maps.google.com?q=${ride.dropoff}`} target="_blank" class="w-full btn-outline btn btn-link">
            <Navigation2 />
            Drop off location
        </a>
        <a href={`https://www.google.com/maps/dir/?api=1&origin=${ride.pickup}&destination=${ride.dropoff}`} target="_blank" class="w-full btn-outline btn btn-link">
            <Map />
            View Ride on Map
        </a>
    </div>  
    <!-- Note -->
    <div class="flex items-start gap-3 w-full p-4 border border-black rounded-sm">
        <MessageSquare class="mt-1" />
        <textarea readonly value={ride.note} class="flex-1 outline-none bg-transparent text-gray-600 h-24"></textarea>
    </div>
    
    <div class="divider mt-4 mb-4 text-gray-500">Passenger details</div>
    <div class="border border-black rounded-sm p-4"> 
        <div class="flex items-start gap-4">
            <!-- Rider Image -->
            <img src={getImageUrl(ride?.expand?.rider, ride?.expand?.rider?.avatar) ?? '/pfp-placeholder.jpg'} alt={ride?.expand?.rider?.first_name} class="w-16 h-16 rounded-full object-cover" />

            <div class="flex-1">
                <!-- Rider Name and Rating -->
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-semibold">{`${ride?.expand?.rider?.first_name} ${ride?.expand?.rider?.last_name}`}</h3>  
                        <div class="flex items-center gap-1 text-sm text-gray-600">  
                            <Hash size={16} class="fill-gray-600 text-gray-600" />
                            <span>{ride?.expand?.rider?.mobile_number}</span>
                        </div>
                    </div>
                    <span class="font-bold text-lg">₱{ride?.amount.toFixed(2)}</span>
                </div> 
            </div>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4">  
        <ConfirmationModal title="Complete" body="Are you sure you want to complete this ride?" btnText="Complete Ride" btnClass="btn btn-primary btn-outline flex-1" next={() => completeRideHandler(ride.id)} />
        <a href="tel:{ride.rider.phone}" class="btn btn-primary flex-1">Contact Rider</a>
    </div>  
</div>