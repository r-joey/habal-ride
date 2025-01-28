<script>
	import { EllipsisVertical, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte"; 
    import { RideForm, DriverOffers, DriverDetailsCard } from "$lib/components/rider";
    import { currentUser, requestRide, pbClient, deleteRide, acceptOffer } from "$lib/pocketbase.svelte";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

    
    let ride = $state(null); 
    $inspect(ride);
    async function cancelRide() {
        const id = ride?.id
        if (id) {
            const {success, message, rideData} = await deleteRide(id);
            if (success) {
                ride = null
                toast.success('Ride canceled');
            } else {
                toast.error(message);
            }
        }
    }
    async function acceptOfferHandler(driverId, amount) {
        if (!driverId || !amount) return
        const data =  {
                "driver": driverId,
                "status": "in_progress",
                "amount": amount
            }; 
        const id = ride?.id
        if (id) {
            const {success, message, rideData} = await acceptOffer(id, data);
            if (success) { 
                ride = rideData
                toast.success(message);
            } else { 
                toast.error(message);
            }
        } 
    }
    async function requestRideHandler(pickup, dropoff, note) { 
        const data = { 
            "rider": $currentUser?.id,
            "note": note,
            "status": "requesting", 
            "pick_up_lat": pickup?.lat,
            "pick_up_lng": pickup?.lng,
            "drop_off_lat": dropoff?.lat,
            "drop_off_lng": dropoff?.lng,
            "expires_at": new Date(Date.now() + 5 * 60 * 1000).toISOString()
        };
        const {success, message, rideData} = await requestRide(data);
        if (success) {
            rideData['pickup'] = rideData.pick_up_lat + ', ' + rideData.pick_up_lng
            rideData['dropoff'] = rideData.drop_off_lat + ', ' + rideData.drop_off_lng
            ride = rideData
            pbClient.collection('rides').subscribe(ride.id, function (e) {
                    switch (e.action) { 
                        case 'update': 
                            if (e.record.status == 'completed') {
                                pbClient.collection('rides').unsubscribe(e.record.id)
                                ride = null
                            } else { 
                                let tempRide = e.record
                                tempRide['pickup'] = tempRide.pick_up_lat + ', ' + tempRide.pick_up_lng
                                tempRide['dropoff'] = tempRide.drop_off_lat + ', ' + tempRide.drop_off_lng 
                                ride = tempRide
                            }
                            break;
                        case 'delete': 
                            console.log('ride deleted')
                            pbClient.collection('rides').unsubscribe(e.record.id)
                            ride = null
                            break;
                }
            }, { expand: "driver" })
            toast.success(message);
        } else {
            toast.error(message);
        } 
    }

    async function getPendingRide(setRide) {
        try { 
            const rider = $currentUser.id
            const res = await pbClient.collection('rides').getFirstListItem(`rider="${rider}" && status != "completed"`, {expand:"driver, driver.vehicles_via_driver"});
            if (res) { 
                console.log('ride found')
                res['pickup'] = res.pick_up_lat + ', ' + res.pick_up_lng
				res['dropoff'] = res.drop_off_lat + ', ' + res.drop_off_lng
                setRide(res)
            } 
        } catch (err) {
            console.log(err)
        }
    }
    onMount(() => {
        (async () => {
            await getPendingRide((rideData)=>{
                ride = rideData  
                pbClient.collection('rides').subscribe(rideData.id, function (e) {
                    switch (e.action) { 
                        case 'update': 
                            if (e.record.status == 'completed') {
                                pbClient.collection('rides').unsubscribe(e.record.id)
                                ride = null
                            } else { 
                                let tempRide = e.record
                                tempRide['pickup'] = tempRide.pick_up_lat + ', ' + tempRide.pick_up_lng
                                tempRide['dropoff'] = tempRide.drop_off_lat + ', ' + tempRide.drop_off_lng 
                                ride = tempRide
                            }
                            break;
                        case 'delete': 
                            console.log('ride deleted')
                            pbClient.collection('rides').unsubscribe(e.record.id)
                            ride = null
                            break;
                }
            }, { expand: "driver" })  
      
            }); 
        })();

        return(() => {
            console.log('unmounted, unsubscribing...')
            pbClient.collection('rides').unsubscribe(); 
        })
    })
 
</script>
 
<div class="flex flex-col gap-4 max-w-md w-full p-4 mt-16 mx-auto"> 
    <RideForm {cancelRide} {requestRideHandler} status = {ride?.status ?? 'idle'} driverPhone = {ride?.expand?.driver?.mobile_number ?? ''}>
        {#if ride?.expand?.driver}
            <DriverDetailsCard amount={ride?.amount} driver={ride?.expand?.driver} />
        {/if} 
    </RideForm> 
    {#if ride && ride?.status === 'requesting'}
        <DriverOffers id={ride.id} {acceptOfferHandler}/>
    {/if}
</div> 
