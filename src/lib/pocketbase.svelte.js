import { goto, invalidateAll } from '$app/navigation';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import Pocketbase from 'pocketbase';
import { get, writable } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { toast } from 'svelte-sonner';

export const pbClient = new Pocketbase(PUBLIC_POCKETBASE_URL);
export const currentUser = writable(pbClient.authStore.model); 
pbClient.authStore.onChange(async () => { 
    console.log('auth store model:', pbClient.authStore.model);
    currentUser.set(pbClient.authStore.model)
    // let tempUser = pbClient.authStore.model
    // try { 
    //     if (pbClient.authStore?.model?.collectionName === 'drivers') {
    //         const vehicle = await pbClient.collection('vehicles').getFirstListItem(`driver="${pbClient.authStore.model.id}"`);
    //         if (vehicle) {
    //             tempUser.expand.vehicles_via_driver = vehicle
    //         }
    //         const subscription = await pbClient.collection('subscriptions').getFirstListItem(`driver="${pbClient.authStore.model.id}"`);
    //         if (subscription) {
    //             tempUser.expand.subscriptions_via_driver = subscription
    //         }
    //     } 
    // } catch (err) {
    //     console.log(err)
    // }
    // currentUser.set(tempUser)  
}, true);
 

export async function signIn (email, password, collection) {
    try {
        
        const authData = await pbClient.collection(collection).authWithPassword(email, password, {expand: "vehicles_via_driver, subscriptions_via_driver"}) 
        if (!authData?.record.verified) {
            return { success: false, message: 'Please verify your email' }
        }
        if (authData) {
            return { success: true, message: 'Signed In Successfully' }
        }
    } catch (err) {  
        return { success: false, message: err.message }
    }
}


export async function signout () {
    try {
       pbClient.authStore.clear();
    } catch (err) {  
        return { success: false, message: err.message }
    }
}


export async function signUp(data, collection) {
    try {
        const record = await pbClient.collection(collection).create(data); 
        if (record) {
            const authData = await pbClient.collection(collection).authWithPassword(data.email, data.password, {expand: "vehicles_via_driver, subscriptions_via_driver"})
            return { success: true, message: 'Signed Up Successfully', riderData: record }
        }
    } catch (err) { 
        return { success: false, message: err?.message ?? "Failed to sign up", riderData: null }
    }
    
}

export async function requestRide(data) {
    try {
        const record = await pbClient.collection('rides').create(data)
        if (record) {
            return { success: true, message: 'Requesting a ride.', rideData: record }
        }
    } catch (err) { 
        return { success: false, message: err?.message ?? "Failed to request a ride", rideData: null }
    }
    
}

export async function acceptOffer(id, data) {
    try {
        const record = await pbClient.collection('rides').update(id, data, {expand: "driver, driver.vehicles_via_driver"})
        if (record) {
            return { success: true, message: 'Offer accepted.', rideData: record }
        }
    } catch (err) { 
        console.log(err)
        return { success: false, message: err?.message ?? "Failed to accept offer", rideData: null }
    }
    
}

export async function deleteRide(id) {
    try {
        const record = await pbClient.collection('rides').delete(id); 
        if (record) {
            return { success: true, message: 'Deleted ride.', rideData: record }
        }
    } catch (err) {  
        console.log(err)
        return { success: false, message: err?.message ?? "Failed to delete ride", rideData: null }
    }
    
}

export async function deletePlace(id) {
    try {
        const record = await pbClient.collection('places').delete(id); 
        if (record) {
            return { success: true, message: 'Place deleted.', rideData: record }
        }
    } catch (err) {  
        console.log(err)
        return { success: false, message: err?.message ?? "Failed to delete place", rideData: null }
    }
    
}

export async function completeRide(id) {
    try {
        const data = { 
            "status": "completed" 
        }; 
        const record = await pbClient.collection('rides').update(id, data); 
        if (record) {
            return { success: true, message: 'Completed ride.', rideData: record }
        }
    } catch (err) {  
        console.log(err)
        return { success: false, message: err?.message ?? "Failed to complete ride", rideData: null }
    }
    
}

export async function getInitialRideOffers(id) {
    console.log('fetching offer id', id)
    try {
        const initialRideOffers = await pbClient.collection('offers').getList(1, 20, { filter: `ride = "${id}"`, expand: "driver, driver.vehicles_via_driver" });
        if (initialRideOffers?.items) { 
           return { success: true, message: 'Got initial offers', initialRideOffers: initialRideOffers.items }
        } else {
            return { success: false, message: 'No offers found', initialRideOffers: [] }
        }
    } catch (err) {  
        console.log(err)
        return { success: false, message: err?.message ?? "Failed to fetch offers" }
    }
    
}

export async function getPreviousRides(riderId, page) {
    try { 
        const limit = 24
        const resultsObject = await pbClient.collection('rides').getList(page, limit, {
            filter: `rider = "${riderId}" && status = "completed"`,
            expand: "driver, driver.vehicles_via_driver, reviews_via_ride",
            sort: '-created'
        }); 
        if (resultsObject?.items) {
            return { success: true, message: 'Got previous rides', resultsObject: resultsObject }
        } else {
            return { success: false, message: 'No previous rides found', previousRides: {} }
        }
    } catch (err) {  
        console.log(err)
        return { success: false, message: err?.message ?? "Failed to fetch previous rides" }
    }
}


export async function rateRide(data) {
    try {
        const record = await pbClient.collection('reviews').create(data);
        if (record) {
            return { success: true, message: 'Rated ride.', reviewData: record }
        }   
    } catch (err) {
        return { success: false, message: err?.message ?? "Failed to rate ride" }
    }
}

export async function updateRateRide(id, data) {
    try {
        const record = await pbClient.collection('reviews').update(id, data);
        if (record) {
            return { success: true, message: 'Updated your rating.', reviewData: record }
        }   
    } catch (err) {
        return { success: false, message: err?.message ?? "Failed to rate ride" }
    }
}

export async function updateProfile(collection, id, data ) {
    try { 
        const record = await pbClient.collection(collection).update(id, data, {expand: "vehicles_via_driver"});
        if (!record) {
            return { success: false, message: 'Failed to update profile.' }
        }
        return { success: true, message: 'Profile updated.' }
        
    } catch (err) {
        console.log(err.message)
        return { success: false, message: err?.message ?? "Failed to update profile" }
    }
}

export async function updatePassword(collection, id, data ) {
    try {
        const record = await pbClient.collection(collection).update(id, data);
        if (!record) {
            return { success: false, message: 'Failed to update password.' }
        }
        return { success: true, message: 'Password Updated.' }
        
    } catch (err) {
        return { success: false, message: err?.message ?? "Failed to update password" }
    }
}

export async function updateVehicle (id, data) {
    try {
        const record = await pbClient.collection('vehicles').update(id, data);
        if (!record) {
            await pbClient.collection('drivers').authRefresh();
            return { success: false, message: 'Failed to update vehicle.' }
        }
        return { success: true, message: 'Vehicle updated.' }
    } catch (err) {
        return { success: false, message: err?.message ?? "Failed to update profile" }
    }
}


export async function createVehicle (data) {
    try {
        const record = await pbClient.collection('vehicles').create(data);
        if (!record) {
            return { success: false, message: 'Failed to create vehicle.', vehicleData: null }
        }
        return { success: true, message: 'Vehicle created.', vehicleData: record }
    } catch (err) {
        return { success: false, message: err?.message ?? "Failed to update profile" }
    }
}
// export async function updateEmail(collection, id, data) {
//     try {
//         const record = await pbClient.collection(collection).update(id, data);
//         if (!record) {
//             return { success: false, message: 'Failed to update email.' }
//         }
//         return { success: true, message: 'Updated email.' }
        
//     } catch (err) {
//         return { success: false, message: err?.message ?? "Failed to update profile" }
//     }
// }

export function getImageUrl(record, filename) {
    try { 
        const url = pbClient.files.getURL(record, filename, {'thumb': '100x0'}); 
        if (url) {
            return url
        }
    } catch (err) {
        console.log(err)
        return null
    }
}