<script> 
	import { on } from 'svelte/events';
	import { get } from 'svelte/store';
    import { Clock, Trash2 } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import { currentUser, pbClient } from '$lib/pocketbase.svelte';
	import { onMount } from 'svelte';

    const { onUpdateSubscription } = $props()
 
    let paymentLoading = $state(false)
    let pendingLoading = $state(false)
    let paymenInstructionsModal;
    let pendingPayments = $state([])   
    
    let subscriptionRemainingDays = $derived.by(() => {
        let remainingDays = 0 
        try {
        const subs = $currentUser?.expand?.subscriptions_via_driver
            if (subs?.length) {
                const expiry = new Date(subs[0]?.expiry)
                const now = new Date()
                remainingDays =  Math.max(
                    Math.floor((expiry - now) / (1000 * 60 * 60 * 24)),
                    0 // Ensure it doesn't return negative values
                );
            }
        } catch (err) {
            console.log(err)
        }
        return remainingDays
    })

    async function getPendingPayments() {
        pendingLoading = true
        try {
            const paymentsResult = await pbClient.collection('payments').getList(1, 50, {
                filter: `driver = "${$currentUser.id}" && verified = false`,
            });
            const paymentsItems = paymentsResult?.items;
            if (paymentsItems?.length) {
                pendingPayments = paymentsItems
            }
        } catch (err) {
            console.log(err)
        }
        pendingLoading = false
    }

    async function getLatestSubscription() {
        pendingLoading = true
        try { 
            const subscriptionResult = await pbClient.collection('subscriptions').getFirstListItem(`driver = "${$currentUser.id}"`); 
            if (subscriptionResult) { 
                onUpdateSubscription(subscriptionResult)
            }
        } catch (err) {
            console.log(err)
        }
        pendingLoading = false
    }

    async function sendPaymentHandler(e) {
        paymentLoading = true
        e.preventDefault();
        try {
            let data = Object.fromEntries( await new FormData(e.target));
            data['driver'] = $currentUser.id
            const payment = await pbClient.collection('payments').create(data);
            if (payment) {
                pendingPayments.push(payment)
                e.target.reset();
                paymenInstructionsModal.close()
            }
        } catch (err) {
            console.log(err)    
        }
        paymentLoading = false

    }
 

    async function deletePaymentHandler(payment) { 
        try { 
            const deletePayment = await pbClient.collection('payments').delete(payment.id);
            if (deletePayment) {
                pendingPayments = pendingPayments.filter(p => p.id !== payment.id)
            }
        } catch (err) {
            console.log(err)    
        } 
        
    }

    onMount(() => {
        (async () => {
            await getPendingPayments()
        })()
    })
 
</script>
 
<div class="divider">Subscription</div>
<div   class="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm bg-gray-50 justify-center w-full">
    <h3 class="text-red-600 text-center">Subscription: {subscriptionRemainingDays} days remaining</h3>
    {#each pendingPayments as payment (payment.id) }
        <div class="flex justify-between w-full border border-gray-300 p-2 rounded-sm">
            <h1 class="flex gap-2 self-center ms-2 text-sm text-gray-500 font-semibold">
                <Clock size={18}/>
                {payment.reference_number}
            </h1>
            <button onclick={() => deletePaymentHandler(payment)} type="button" class="btn btn-sm btn-ghost"> 
                    <Trash2 size={16}/> 
            </button>
        </div>
    {/each}   
    <button type="button" onclick={() => paymenInstructionsModal.showModal()} class="btn btn-primary w-full mt-2">Pay(+15 days)</button>  
    <button type="button" onclick={() => {getPendingPayments(); getLatestSubscription();}} class="btn btn-outline w-full mt-2">
        {#if pendingLoading}
            <span class="loading loading-spinner loading-md"></span>
        {/if}
        Refresh
    </button>  
</div>

<dialog bind:this={paymenInstructionsModal} class="modal">
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
        <h3 class="text-lg font-semibold text-center mb-4">Payment Instructions</h3>
        <ul class="space-y-4">
            <li>
                <p><strong>Step 1:</strong> Scan QR code to pay. Take note of the reference number.</p>
                <img src="/250-qr.jpg" alt="250 QR" class="w-full rounded-lg shadow">
            </li>
            <li>
                <p><strong>Step 2:</strong> Enter reference number and tap send payment</p>  
                <form onsubmit={(e) => sendPaymentHandler(e)}>
                    <input name="reference_number"  type="text" class="mt-4  input input-bordered w-full max-w-md" required /> 
                    <button type="submit" disabled={paymentLoading} placeholder="Reference Number" class="btn btn-primary w-full mt-4">
                        {#if paymentLoading}
                        <span class="loading loading-spinner loading-md"></span>
                        {/if}
                        Send Payment
                    </button>
                </form>
            </li>
            
            <li>
                <p><strong>Step 3:</strong> Wait for approval</p>  
            </li>
        </ul>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>