<script>
	import { on } from 'svelte/events';
	import { PhilippinePeso, Hash, Map, SquareX, Ban, EyeOff, EllipsisVertical, Check, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte"; 
    import { pbClient, currentUser, getImageUrl } from "$lib/pocketbase.svelte";
    import { toast } from 'svelte-sonner';
    const { nearbyRide, hideRide, cancelOffer, sendOffer } = $props() 
    const riderDeatils = nearbyRide?.expand?.rider
    let loading = $state(false)
    let offer = $derived.by(() => {
            if (nearbyRide?.expand?.offers_via_ride?.length > 0) {
                return nearbyRide?.expand?.offers_via_ride[0]
            } else {
                return null
            }
        })

    async function sendOfferHandler (e) {
        loading = true
        const { success, message } = await sendOffer(e, nearbyRide.id)
        if (success) {
            toast.success('Offer sent')
        } else {
            toast.error(message)
        }
        loading = false
    }
    
    async function cancelOfferHandler (id) {
        loading = true
        const { success, message } = await cancelOffer(id, nearbyRide.id)
        if (success) {
            toast.success('Offer cancelled')
        } else {
            toast.error(message)
        } 
        loading = false
    }
</script>

 
<div class="w-full max-w-md mx-auto border border-gray-300 rounded-sm p-4 bg-gray-50">
    <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-4">
        <!-- <img class="w-16 h-16 rounded-sm object-cover" src="/pfp-placeholder.jpg" alt="pfp placeholder" />   -->
        <img class="w-16 h-16 rounded-sm object-cover" src={getImageUrl(riderDeatils, riderDeatils.avatar) ?? '/pfp-placeholder.jpg'} alt={riderDeatils.first_name} >
        <div>
        <h2 class="text-xl font-semibold text-gray-600">{riderDeatils.first_name} {riderDeatils.last_name}</h2>
        </div>
    </div>
    <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="self-end btn btn-ghost me-0">
                <EllipsisVertical /> 
        </div>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box gap-2 z-[1] w-52 p-2 shadow-2xl">
            <li><button onclick={() => hideRide(nearbyRide.id)} class="btn-outline btn-sm btn"><EyeOff size={16} />Remove</button></li>  
        </ul>
    </div> 
    </div>
    <p class="text-sm text-gray-700 mb-2">{nearbyRide.note}</p>
    <form onsubmit={(e) => sendOfferHandler(e)} class="flex space-x-2">
    <div class="join w-full mt-2">
        <!-- <input name="offerAmount" type="number" value={offerAmount} class="font-bold w-full input input-bordered join-item" placeholder="Enter Amount" /> -->
        <label class="font-bold join-item input-sm input input-bordered flex items-center gap-2">
            <PhilippinePeso color="gray" size={24}/>
            <input readonly={!!offer} value={offer?.amount ?? ""} name="offerAmount" class="w-full input-sm" type="number" placeholder="Offer Amount" />
        </label>

        {#if offer}
            <button disabled={loading} onclick={() => cancelOfferHandler(offer.id)} type="button" class="btn btn-primary btn-sm  join-item">
                {#if loading}
                    <span class="loading loading-spinner loading-sm"></span>
                {/if}
                Cancel Offer
            </button>
        {:else}
            <button disabled={loading} type="submit" class="btn btn-primary btn-sm join-item">
                {#if loading}
                    <span class="loading loading-spinner loading-sm"></span>
                {/if}
                Send Offer
            </button>
        {/if}
    </div>
    </form>
    <a target="_blank" href={`https://www.google.com/maps/dir/?api=1&origin=${nearbyRide.pick_up_lat},${nearbyRide.pick_up_lng}&destination=${nearbyRide.drop_off_lat},${nearbyRide.drop_off_lng}`}  class="btn btn-primary mt-4 btn-sm w-full">Preview Ride</a>
</div> 
 