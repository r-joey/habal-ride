<script>
	import { EllipsisVertical, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte";
    import LocationPicker from "./LocationPicker.svelte";
    import { ConfirmationModal } from "$lib/components";
    let pickup = $state("");
	let dropoff = $state("");
	let note = $state("");
    
    // $inspect('pickup',pickup);
    // $inspect('dropoff',dropoff);
    function clearFields () {
        pickup = "";
        dropoff = "";
        note = "";
    }
    const { cancelRide, children, requestRideHandler, status, driverPhone } = $props();
</script>
<div class="flex flex-col gap-4 border border-gray-300 p-4 rounded-sm bg-gray-50"> 
    <div class="divider text-gray-500">Ride details</div> 
    <div class="flex flex-col gap-4 justify-between">
        <LocationPicker locationName="Pick up" {status} bind:location={pickup} /> 
        <LocationPicker locationName="Drop off" {status} bind:location={dropoff} />
    </div> 
    
    <!-- Note -->
    <div class="flex items-start gap-3 w-full p-4 border border-black rounded-sm">
        <MessageSquare class="mt-1" />
        <textarea disabled={status !== 'idle'} bind:value={note} placeholder="Add a note for your driver (optional)" class="flex-1 outline-none bg-transparent resize-none h-24 text-gray-500"></textarea>
    </div>
    {@render children?.()}
    <div class="flex gap-4"> 
        {#if status === 'requesting'}
            <button onclick={() => {clearFields(); cancelRide()}} class="flex-1 btn btn-outline btn-primary">
                <span class="loading loading-spinner loading-md"></span>
                Cancel Request
            </button> 
        {:else if status === 'in_progress'}
            <!-- <button onclick={() => {clearFields(); cancelRide()}} class="flex-1 btn btn-outline btn-primary">
                Cancel Ride
            </button>  -->
            <ConfirmationModal title="Cancel" body="Are you sure you want to cancel this ride? You will not be able to rate the driver." btnText="Cancel Ride" btnClass="flex-1 btn btn-outline btn-primary" next={() => {clearFields(); cancelRide()}} />
        {:else}
            <button onclick={() => requestRideHandler(pickup, dropoff, note)} class="flex-1 btn btn-primary" disabled={!pickup || !dropoff}>
                Find a Driver
            </button> 
        {/if}
        {#if driverPhone}
            <a href="tel:{driverPhone}" class="btn btn-primary flex-1">Contact driver</a>
        {/if} 
    </div>   
</div>