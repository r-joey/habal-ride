<script> 
    import { Check, Bike, MapPin, Navigation2, MessageSquare, Star, Car } from "lucide-svelte";
    import { currentUser, rateRide, updateRateRide }  from "$lib/pocketbase.svelte";
    import { toast } from 'svelte-sonner';
    let modalElement;
    let loading = $state(false);
    const { prevRide, updateRating } = $props();


    let formRating = $state(0);
    let formComment = $state('');
    let isEditing = $state(false); 

    async function handleUpdateRating () {
        loading = true;
        if (!formRating || !formComment || !existingReview) {
            toast.error('Please enter rating and comment');
            return;
        } 
        const data = {
            "ride": prevRide.id,
            "rider": $currentUser.id,
            "rating": formRating,
            "comment": formComment
        };
        const { success, message, reviewData } = await updateRateRide(existingReview.id, data);
        if (success) {
            toast.success(message);
            updateRating(prevRide.id, reviewData);
            modalElement.close();
        }
        loading = false
    }

    async function handleSubmitRating() {
        loading = true
        if (!formRating || !formComment) {
            toast.error('Please enter rating and comment');
            return;
        } 
        const data = {
            "ride": prevRide.id,
            "rider": $currentUser.id,
            "rating": formRating,
            "comment": formComment
        };
        const { success, message, reviewData } = await rateRide(data);
        if (success) {
            toast.success(message);
            updateRating(prevRide.id, reviewData);
            modalElement.close();
        }
        loading = false
    }


    let existingReview = $derived.by(() => {
        const reviews = prevRide?.expand?.reviews_via_ride;
        if (reviews?.length && reviews[0].rider === $currentUser.id) {
            return reviews[0];
        }
        return null;
    });

    let modified = $derived.by(() => {
        if (existingReview && existingReview.rating !== formRating || existingReview.comment !== formComment) {
            return true;
        }
        return false;
    })

    $effect(() => {
        if (existingReview) {
            formRating = existingReview.rating;
            formComment = existingReview.comment;
        }
    });
    
    function closeHandle(){
        if (existingReview) {
            formRating = existingReview.rating;
            formComment = existingReview.comment;
        } else {
            formRating = 0;
            formComment = '';
        }
    }
 
 
</script>

{#if existingReview}
    <button class="grow btn btn-primary" onclick={() => modalElement.showModal()}>
        {#each [1,2,3,4,5] as star}
            <Star size={16} class={star > formRating ? `` : `fill-white`} />
        {/each} 
    </button>
{:else}
    <button class="grow btn btn-primary" onclick={() => modalElement.showModal()}>Rate</button>
{/if}

<dialog bind:this={modalElement} class="modal">
    <div class="modal-box">
        <h3 class="font-semibold text-center">Rate your experience</h3>
        <div class="flex mt-4 p-2 gap-2 justify-between">
            {#each [1, 2, 3, 4, 5] as star}
                <button class="btn btn-sm" onclick={() => formRating = star}>
                    <Star size={24} class={star > formRating ? "" : "fill-black"} />
                </button>
            {/each}
        </div>
        <div class="p-2">    
            <textarea bind:value={formComment} name="comment" class="w-full textarea textarea-bordered" placeholder="Add a comment"></textarea>
        </div>
        <div class="modal-action w-full">
        <form class="flex gap-2 justify-between" method="dialog">  
            <button onclick={() => closeHandle()} class="btn" >Cancel</button>
            {#if existingReview}
                <button disabled={!modified || loading } type="button" onclick={handleUpdateRating} class="btn btn-primary">
                    {#if loading}
                        <span class="loading loading-spinner"></span>
                    {/if}
                    Update
                </button>
            {:else}
                <button disabled={!formRating || !formComment || loading} type="button" onclick={handleSubmitRating} class="btn btn-primary">
                    {#if loading}
                        <span class="loading loading-spinner"></span>
                    {/if} 
                    Submit
                </button>
            {/if}
        </form>
        </div>
    </div>
</dialog>