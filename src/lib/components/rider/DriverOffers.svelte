<script>
	import { EllipsisVertical, Bike, MapPin, Navigation2, MessageSquare, Star, Car, Inspect, SquareCheck  } from "lucide-svelte";
    import { currentUser, getInitialRideOffers, pbClient, getImageUrl } from "$lib/pocketbase.svelte";
    import { ConfirmationModal } from '$lib/components'
	import { onMount } from "svelte";
    const { acceptOfferHandler, id } = $props();

    let driverOffers = $state([]);
    $inspect(driverOffers)
    function declineOffer(offerId) {
        driverOffers = driverOffers.filter(offer => offer.id !== offerId)
    }
    onMount(() => {
        (async () => {
            const { success, message, initialRideOffers } = await getInitialRideOffers(id);
            if (success) {
                driverOffers = [...initialRideOffers]
            } else {
                console.log('no offfers found')
                console.log(message)
            }
        })();
 
        pbClient.collection('offers').subscribe('*', function (e) {
        switch (e.action) {
              case 'create':
                // push new record
                if (!driverOffers.some(offer => offer.id === e.record.id)) {
                  driverOffers.push(e.record);
                }
                break
              case 'update':
                // update the item in the list
                driverOffers = driverOffers.map(offer => offer.id === e.record.id ? e.record : offer)  
                break;
              case 'delete':
                // in case delete, remove the item from the list
                driverOffers = driverOffers.filter(offer => offer.id !== e.record.id)
                break;
               
          }
      }, { filter: `ride= "${id}"`, expand: "driver, driver.vehicles_via_driver" });

      return () => { 
        pbClient.collection('offers').unsubscribe()
      }
    })
</script>


<div class="divider font-semibold">Available Drivers</div>
<div class="space-y-4"> 
    <!-- Drivers List -->
    {#each driverOffers as offer (offer.id)}
        <div class="border border-gray-300 rounded-sm p-4 bg-gray-50">
            <div class="flex items-start gap-4">
                <!-- Driver Image -->
                <img src={getImageUrl(offer?.expand?.driver, offer?.expand?.driver?.avatar) ?? '/pfp-placeholder.jpg'} alt={offer?.expand?.driver.first_name} class="w-16 h-16 rounded-sm object-cover" />

                <div class="flex-1">
                    <!-- offer?.expand?.Driver Name and Rating -->
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-semibold">{offer?.expand?.driver.first_name} {offer?.expand?.driver.last_name}</h3>
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <div class="flex items-center gap-1 text-sm text-gray-600">
                                    <Star size={16} class="fill-gray-600 text-gray-600" />
                                    <span>{offer?.expand?.driver.rating}</span>
                                    <span>({offer?.expand?.driver.trips} trips)</span> 
                                </div> 
                            </div> 
                        </div>
                        <div class="text-right">
                            <span class="font-semibold text-lg bg-black text-white px-2 py-0.5 rounded-sm">₱{offer?.amount.toFixed(2)}</span> 
                        </div>
                    </div>

                    <!-- Vehicle Information -->
                    <div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <Bike size={16} />
                        <span>{offer?.expand?.driver?.expand?.vehicles_via_driver?.color} {offer?.expand?.driver?.expand?.vehicles_via_driver?.brand} {offer?.expand?.driver?.expand?.vehicles_via_driver?.model}</span>
                        <span class="px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                            {offer?.expand?.driver?.expand?.vehicles_via_driver?.plate}
                        </span>
                    </div> 
                    <!-- Actions -->

                    <div class="flex justify-between items-center gap-2 mt-4">
                        <button onclick={() => declineOffer(offer?.id)} class="btn btn-outline btn-primary">Decline</button>
                        <!-- <button onclick={() => acceptOfferHandler(offer?.expand?.driver.id, offer?.amount)} class="grow btn btn-primary">Accept Offer</button> -->
                        <ConfirmationModal title="Accept" body="Are you sure you want to accept this offer?" btnText="Accept Offer" btnClass="grow btn btn-primary" next={() => acceptOfferHandler(offer?.expand?.driver.id, offer?.amount)} />
                    </div>
                </div>
            </div>
        </div>
    {/each}
</div>