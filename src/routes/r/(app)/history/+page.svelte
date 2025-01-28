<script>
    import { Check, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte";
    import { getPreviousRides, currentUser, getImageUrl } from "$lib/pocketbase.svelte";
    import { ReviewModal } from "$lib/components";
    import { toast } from 'svelte-sonner';
    import { onMount } from "svelte"; 

    let prevRidesLocal = $state({});
    let loading = $state(false);
    let prevRides = $state([]);
    let currentPage = $derived(prevRidesLocal?.page + 1);

    $inspect(prevRidesLocal)
    function formatDateToShort(dateString) {
        const date = new Date(dateString);
        try { 

        if (isNaN(date.getTime())) {
            throw new Error("Invalid date string");
        }

        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }).format(date);
        } catch (err) {
            console.error(err.message);
            return dateString;
        }
    } 
    
    async function loadMore() { 
        console.log(currentPage)
        const { success, message, resultsObject } = await getPreviousRides($currentUser.id, currentPage);
        if (success) {
            prevRidesLocal = resultsObject;
            prevRides.push(...resultsObject.items);
        } else {
            toast.error(message);
        }
    }
    async function getPrevRides() {
        loading = true
        const { success, message, resultsObject } = await getPreviousRides($currentUser.id, 1); 
        if (success) {
            prevRidesLocal = resultsObject;
            prevRides.push(...resultsObject.items);
        } else {
            toast.error(message);
        }
        loading = false
    } 


    function updateRating(rideId, rating) { 
        if (!rating) return
        console.log(`attempting to update the preRides list with rating ${rating}`)
        prevRides = prevRides.map((ride) =>  
              ride.id === rideId ? { ...ride, expand: {...ride.expand, reviews_via_ride: [rating]} } : ride
        );
    }

    onMount(() => {
        (async () => {
            await getPrevRides(); 
        })();
    });

</script>
<div class="p-4 mt-10"> 
<div class="divider text-gray-500 font-semibold">History</div> 
<div class="space-y-4"> 
      
    {#if loading} 
        <div class="flex flex-col items-center justify-center h-[calc(100vh-308px)]">
            <div class="flex flex-col items-center justify-center">
                <span class="loading loading-spinner loading-lg"></span>
                <h2 class="mt-4 text-lg font-semibold text-gray-600">Loading Previous Rides</h2>
            </div>
        </div>
        
        <!-- <div class="flex flex-col items-center justify-center h-[calc(100vh-308px)]">
            <div class="flex flex-col items-center justify-center">
                <div class="flex items-center justify-center">
                    <Star size={40} class="fill-gray-600 text-gray-600" />
                </div>
                <h2 class="mt-4 text-lg font-semibold text-gray-600">No Previous Rides</h2>
            </div>
        </div> -->
    {/if}
  
  
    <!-- Drivers List -->
    {#each prevRides as prevRide (prevRide.id)}
        <div class="border border-gray-300 rounded-sm p-4 bg-gray-50">
            <div class="flex items-start gap-4">
                <!-- Driver Image -->
                <img src={getImageUrl(prevRide?.expand?.driver, prevRide?.expand?.driver?.avatar) ?? '/pfp-placeholder.jpg'} alt={prevRide?.expand?.driver?.first_name} class="w-16 h-16 rounded-full object-cover" />

                <div class="flex-1"> 
                    <div class="flex justify-between items-start">
                        <div class="w-7/12">
                            <h3 class="font-semibold mb-1">{prevRide?.expand?.driver?.first_name} {prevRide?.expand?.driver?.last_name}</h3>
                            <div class=" flex-wrap flex items-center gap-1 text-sm text-gray-600">
                                <svg fill="#6B7280" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 581.4 581.4" xml:space="preserve">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <g>
                                        <g id="Layer_1_117_">
                                            <g>
                                            <path
                                                d="M289.425,376.125c-28.05,0-51,22.95-51,51V530.4c0,28.05,22.95,51,51,51s51-22.95,51-51V427.125 C340.425,399.075,317.476,376.125,289.425,376.125z"
                                            ></path>
                                            <path
                                                d="M474.3,63.75h-98.175C364.65,26.775,330.226,0,289.425,0s-75.225,26.775-86.7,63.75h-96.9 c-14.025,0-25.5,11.475-25.5,25.5s11.475,25.5,25.5,25.5H204l0,0c6.375,21.675,20.4,39.525,39.525,51 c-68.85,20.4-119.85,84.15-119.85,159.375V459c0,22.95,19.125,42.075,42.075,42.075h34.425V428.4 c0-49.726,40.8-90.525,90.525-90.525c49.725,0,90.525,40.8,90.525,90.525v72.675h34.425c22.95,0,42.075-19.125,42.075-42.075 V326.4c0-75.226-51-140.25-119.851-159.375c19.125-11.475,33.15-29.325,39.525-51l0,0h98.175c14.025,0,25.5-11.475,25.5-25.5 C499.8,75.225,488.325,63.75,474.3,63.75z M289.425,141.525c-28.05,0-51-22.95-51-51c0-28.05,22.95-51,51-51s51,22.95,51,51 C341.7,118.575,318.75,141.525,289.425,141.525z"
                                            ></path>
                                            </g>
                                        </g>
                                        </g>
                                    </g>
                                </svg> 
                                <span>{prevRide?.expand?.driver?.expand?.vehicles_via_driver?.color}</span>
                                <span>{prevRide?.expand?.driver?.expand?.vehicles_via_driver?.brand}</span>
                                <span>{prevRide?.expand?.driver?.expand?.vehicles_via_driver?.model}</span>
                                <span class="px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                                    {prevRide?.expand?.driver?.expand?.vehicles_via_driver?.plate}
                                </span>
                            </div>         
                        </div>
                        <div class="text-right">
                            <h3 class="font-bold mb-1">${prevRide?.amount?.toFixed(2)}</h3>
                            <div class="mt-0 text-sm text-gray-600">
                                <span>{formatDateToShort(prevRide.created)}</span>
                            </div>
                        </div>
                    </div>

                   
                    <div class="mt-3 flex items-center gap-2 text-sm text-gray-600"> 
                        <p>{prevRide?.note}</p>
                    </div>

                    <!-- Accept Button -->
                    <div class="flex justify-between items-center gap-2 mt-4">
                        <a href={`https://www.google.com/maps/dir/?api=1&origin=${prevRide?.pick_up_lat},${prevRide?.pick_up_lng}&destination=${prevRide?.drop_off_lat},${prevRide?.drop_off_lng}`} target="_blank" class="btn btn-outline btn-primary">Preview</a>
                        <ReviewModal {updateRating} {prevRide} />
                    </div>
                </div>
            </div>
        </div>
    {/each}
    
    {#if !loading && prevRidesLocal?.items?.length > 0 && prevRidesLocal?.page < prevRidesLocal?.totalPages}
    <div class="flex items-center justify-center mt-4"> 
        <div class="flex flex-col items-center">
            <button onclick={loadMore} class="btn btn-primary btn-outline">
                Load more
            </button>
            <span class="text-sm text-gray-600 mt-2">{prevRidesLocal?.items?.length} of {prevRidesLocal?.totalItems}</span>

        </div>
    </div>
    {/if}
</div>
</div>