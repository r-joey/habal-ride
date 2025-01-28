<script>
	import { Map, SquareX, Ban, EyeOff, EllipsisVertical, Check, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte";
    import { RideDetailsCard, RidersNearby } from "$lib/components/driver";
	import { calculateBounds } from "$lib/utils"
	import { onMount } from "svelte";
	import { toast } from 'svelte-sonner';
	import { pbClient, currentUser, getImageUrl, completeRide } from "$lib/pocketbase.svelte";
 
	let ride = $state(null);
	
	$inspect(ride)
	console.log($currentUser)

	let hasVehicle  = $derived(!!$currentUser?.expand?.vehicles_via_driver)
	let hasSubscriptionExpired = $derived.by(() => {
		let expired = true 
		try {
		const subs = $currentUser?.expand?.subscriptions_via_driver
			if (subs?.length) {
				const expiry = new Date(subs[0]?.expiry)
				const now = new Date()
				expired = now > expiry
			}
		} catch (err) {
			console.log(err)
		}
		return expired
	})
	function updateRide (rideData) {
		if (!rideData) {
			pbClient.collection('rides').unsubscribe(ride.id)
			toast.error('Ride cancelled.')
		}
		ride = rideData
	}	
	
	function onOfferAccepted(rideData) {
		rideData['pickup'] = rideData.pick_up_lat + ', ' + rideData.pick_up_lng
		rideData['dropoff'] = rideData.drop_off_lat + ', ' + rideData.drop_off_lng 
		ride = rideData 
		toast.success('Offer accepted')
	}
 
	async function getCurrentActiveRide(setRide) {
		try { 
			console.log(`checking for existing ride for this driver ${$currentUser.id}`)
			const res = await pbClient.collection('rides').getFirstListItem(`driver = "${$currentUser.id}" && status = 'in_progress'`, {expand: 'rider, offers_via_ride'});
			if (res) {
				console.log('ride found')
				res['pickup'] = res.pick_up_lat + ', ' + res.pick_up_lng
				res['dropoff'] = res.drop_off_lat + ', ' + res.drop_off_lng
				setRide(res)
			}
		} catch (err) {
			console.log(err?.message ?? "Failed to get current active ride")
		}
	}
  
  
    onMount(() => { 
        (async () => { 
			await getCurrentActiveRide((res)=>{
				ride = res
			}) 
        })(); 
    })

	async function completeRideHandler (id) { 
		const {success, message, rideData} = await completeRide(id)
		if (success) {
			ride = null
			toast.success('Ride completed')
		} else {
			toast.error(message)
		}
		 
	}
  
</script>
 
<div class="p-4 mt-14 flex flex-col gap-4 max-w-md w-full mx-auto"> 
	{#if ride}
		<RideDetailsCard {completeRideHandler} {updateRide} {ride} />
	{/if}
	
	{#if !ride && hasVehicle && !hasSubscriptionExpired}
		<RidersNearby {onOfferAccepted}/>
	{/if}

	{#if !hasVehicle}
		<div class="flex flex-col items-center justify-center gap-4">
			<div role="alert" class="alert alert-error"> 
				<span>You don't have a vehicle registered with us. Please <a class="link" href="/d/account">add</a> a vehicle to get started.</span>
			  </div>  
		</div>
	{/if}

	{#if hasSubscriptionExpired}
		<div class="flex flex-col items-center justify-center gap-4">
			<div role="alert" class="alert alert-error">
				<span>Your subscription has expired. Please <a class="link" href="/d/account">upgrade</a> to get started.</span>
			  </div>  
		</div>
	{/if}
</div> 
