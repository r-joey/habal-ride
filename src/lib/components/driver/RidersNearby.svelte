<script>
	import { get } from 'svelte/store';
	import { Hash, Map, SquareX, Ban, EyeOff, EllipsisVertical, Check, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte"; 
	import { onMount } from "svelte";
	import { toast } from 'svelte-sonner';
	import { pbClient, currentUser, getImageUrl } from "$lib/pocketbase.svelte";
	import { calculateBounds } from "$lib/utils"
    import { NearbyRideCard } from "$lib/components/driver";
    const { onOfferAccepted } = $props()
	let driverLocation = $state(null)
    let nearbyRides = $state([]);  
	const defaultRadiusInKm = 3

	// $inspect(nearbyRides)
    

    function hideRide(rideId) {
        nearbyRides = nearbyRides.filter(ride => ride.id !== rideId)
    }

    async function cancelOffer(offerId, nearbyRideId) {
        try {
            const record = await pbClient.collection('offers').delete(offerId);
            if (!record) return
            console.log('offer deleted', record)
            nearbyRides = nearbyRides.map((ride) =>  
              ride.id === nearbyRideId ? { ...ride, expand: {...ride.expand, offers_via_ride: []} } : ride
            );
            return { success: true, message: 'Offer cancelled.' }
        } catch (err) {
            return { success: false, message: err.message }  
        }
    }

    async function sendOffer(e, nearbyRideId) { 
        e.preventDefault();
        const formData = new FormData(e.target);
        const amount = formData.get('offerAmount')
        if (!amount) return
        try {
            const data = {
                "ride": nearbyRideId,
                "driver": $currentUser.id,
                "amount": amount
            };
            const record = await pbClient.collection('offers').create(data);
            if (!record) return
            nearbyRides = nearbyRides.map((ride) =>  
              ride.id === nearbyRideId ? { ...ride, expand: {...ride.expand, offers_via_ride: [record]} } : ride
            );
            return { success: true, message: 'Offer sent.' }
        } catch (err) {
            console.log(err)
            return { success: false, message: err.message }
        }
    }

    async function fetchNearbyRides(position) {
        console.log('fetching nearby rides')
        const bounds = calculateBounds(position.coords.latitude, position.coords.longitude, defaultRadiusInKm);
        const filter = `
                pick_up_lat >= ${bounds.minLat} && pick_up_lat <= ${bounds.maxLat} &&
                pick_up_lng >= ${bounds.minLng} && pick_up_lng <= ${bounds.maxLng}
                `;
        try {
            const initialNearbyRides = await pbClient.collection('rides').getList(1, 50, {filter: `${filter} && status = 'requesting'`, expand: 'rider, offers_via_ride'});
            if (initialNearbyRides){
                initialNearbyRides.items.forEach(nearbyRide => {
                    if(!nearbyRides.some(ride => ride.id === nearbyRide.id)) {
                        nearbyRides.push(nearbyRide)
                    }
                })
                nearbyRides = initialNearbyRides.items
            }
        } catch (err) {
            console.log(err)
        }
    }
	async function subscribeToNearbyRides (filter, expand) { 
		pbClient.collection('rides').subscribe('*', function (e) {
          switch (e.action) {
              case 'create': 
                // push new record
                if (!nearbyRides.some(ride => ride.id === e.record.id)) {
                    nearbyRides.push(e.record);
                }
                break
              case 'update':
                // and status is not requesting remove from the list 
                if (e.record.status !== 'requesting' && e.record?.driver !== $currentUser.id) {
                  nearbyRides = nearbyRides.filter(ride => ride.id !== e.record.id)
                }
                else if (e.record.status === 'in_progress' && e.record?.driver === $currentUser.id) {
                    // update and status is in progress, and driver_id is the current driver
                    // pbClient.collection('rides').unsubscribe()
                    console.log('ride accepted') 
                    onOfferAccepted(e.record)
                }
                else { 
                  // if update and status is returning to requesting, then add to the list
                  nearbyRides.push(e.record);
                }
                break;
              case 'delete':
                // in case delete, remove the item from the list
                nearbyRides = nearbyRides.filter(ride => ride.id !== e.record.id)
                break;
               
          }
        }, {filter: filter, expand: expand});
    } 

  
	async function locationSuccess(position) {  
		if (position.coords.latitude !== driverLocation?.lat || position.coords.longitude !== driverLocation?.lng) {
			driverLocation = {
                    lat : position.coords.latitude,
                    lng : position.coords.longitude
                }
            const bounds = calculateBounds(driverLocation.lat, driverLocation.lng, defaultRadiusInKm);
            const filter = `
                pick_up_lat >= ${bounds.minLat} && pick_up_lat <= ${bounds.maxLat} &&
                pick_up_lng >= ${bounds.minLng} && pick_up_lng <= ${bounds.maxLng}
                `;
            const expand = 'rider, offers_via_ride' 
			await subscribeToNearbyRides(filter, expand) 
		} else {
            console.log('monitored location but no change')
        } 
	}  

	function locationError(error){
		toast.error(error?.message ?? 'Something went wrong while updating location.')
	}


	onMount(() => {
        (async () => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        await fetchNearbyRides(position) 
                    },
                    (error) => {
                        toast.error(error?.message ?? 'Something went wrong while updating location.')
                    }
                )
            }
            
        })();
        const watchId = navigator.geolocation.watchPosition(locationSuccess, locationError, {enableHighAccuracy: true,}) 
        return () => { 
			navigator.geolocation.clearWatch(watchId);
			pbClient.collection('rides').unsubscribe(); 
		}
    })
</script>

<div class="divider text-gray-500 font-semibold my-0">Riders nearby</div>
<div class="space-y-4"> 
    <!-- Riders List -->
    {#each nearbyRides as nearbyRide (nearbyRide.id)}
        <NearbyRideCard {nearbyRide} {hideRide} {cancelOffer} {sendOffer} /> 
    {/each}

    {#if nearbyRides.length === 0}
        <div class="flex flex-col items-center justify-center h-[calc(100vh-308px)]">
            <div class="loader"></div>
            <p class="mt-24 text-gray-500 font-semibold">Waiting for nearby rider requests...</p>
        </div> 
    {/if}
</div>



<style>
    /* HTML:  */
    .loader {
    width: 20px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #555050;
    box-shadow: 0 0 0 0 #0004;
    animation: l2 1.5s infinite linear;
    position: relative;
    }
    .loader:before,
    .loader:after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: 0 0 0 0 #0004;
    animation: inherit;
    animation-delay: -0.3s;
    }
    .loader:after {
    animation-delay: -1s;
    }
    @keyframes l2 {
        100% {box-shadow: 0 0 0 80px #0000}
    }
</style>