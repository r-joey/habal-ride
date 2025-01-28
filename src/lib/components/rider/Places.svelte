<script> 
    import { MapPin, LocateFixed, Trash2 } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import { LeafletMap } from "$lib/components";
    let modalElement
    let view = $state(null);  
    let places = $state([])
    let location = $state(null);

    $inspect(places)

    
    $effect(() => {
        const storedPlaces = localStorage.getItem("habalRidePlaces")
        if (storedPlaces) places = JSON.parse(storedPlaces)
    })
    
    $effect(() => {
        localStorage.setItem("habalRidePlaces", JSON.stringify(places))
    })
    
    function remove(place) {
        places = places.filter(p => p.id !== place.id)
    }

    function save(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));

        if (!location) {
            toast.error('Please select a location')
            return
        }

        if (!data['name']) {
            toast.error('Please enter a name')
            return
        } 
        
        data['id'] = crypto.randomUUID()
        data['location'] = location
        places.push(data) 
        e.target.reset();
        modalElement.close()
    }
</script>


<div class="divider">Saved Places<small class="text-gray-500 font-thin">(stored in device)</small></div>
<div class="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm bg-gray-50 justify-center w-full"> 
    {#each places as place }
        <div class="flex justify-between w-full border border-gray-300 p-2 rounded-sm">
            <h1 class="flex gap-2 self-center ms-2 text-sm font-semibold">
                <MapPin size={18}/>
                {place.name}
            </h1>
            <button onclick={() => remove(place)} type="button" class="btn btn-sm btn-ghost"> 
                    <Trash2 size={16}/> 
            </button>
        </div>
    {/each} 
    <button onclick={() => {modalElement.showModal()}} type="button" class="btn btn-primary w-full mt-2">Add</button>
</div>




<dialog bind:this={modalElement} class="modal">
    <div class="modal-box">
    <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-center font-bold text-lg mb-2">Pick a location</h3> 
    
    <form onsubmit={(e) => save(e)} class="mb-2 w-full"> 
        <div class="join w-full">
            <input name="name" placeholder="Enter a name for this place." type="text" class="input-bordered join-item input w-full" />  
            <button type="submit" class="btn btn-primary join-item">Save</button>
        </div>
    </form>  
       
    <LeafletMap mapClass="w-full h-[calc(100vh-308px)] border border-gray-300 rounded-sm -z-1" {view} setMapCenter={(e) => location = e}/> 
    </div>
</dialog>