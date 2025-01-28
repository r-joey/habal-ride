<script>
 
	  import { EllipsisVertical, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte";
    import { LeafletMap } from "$lib/components";
	  import { toast } from "svelte-sonner";
    import { currentUser } from "$lib/pocketbase.svelte";
	  import { onMount } from "svelte";
    let { status, locationName, location =  $bindable() } = $props(); 
    let modalElement;

    const savedLocations = localStorage.getItem("habalRidePlaces")
      ? JSON.parse(localStorage.getItem("habalRidePlaces"))
      : [];

    let view = $state(null);     
</script>

<button  onclick={() => {modalElement.showModal()}} disabled={status !== 'idle' || !$currentUser?.verified} class="w-full btn btn-primary text-sm">
  {#if locationName === 'Pick up'}  
  <MapPin />
  {:else if locationName === 'Drop off'}
  <Navigation2 />
  {/if}
  {locationName}
</button>

<dialog bind:this={modalElement} class="modal">
    <div class="modal-box">
      <h3 class="text-center font-bold text-lg mb-2">{locationName}</h3>
      <div class="flex flex-wrap gap-2 mb-2"> 
        {#each savedLocations as loc }
          <button onclick={() => {view = loc.location}} class="btn btn-sm ">{loc.name}</button>
        {/each}
      </div>
       
      <LeafletMap mapClass="w-full h-[calc(100vh-308px)] border border-gray-300 rounded-sm -z-1" {view} setMapCenter={(e) => location = e}/>
    
      <div class="modal-action">
        <form   method="dialog">
          <button onclick={() => {modalElement.close()}} type="button" class="btn mr-2">Close</button>
          <button onclick={() => {modalElement.close()}} type="button" class="btn btn-primary">Confirm</button>
        </form>
      </div>
    </div>
</dialog>