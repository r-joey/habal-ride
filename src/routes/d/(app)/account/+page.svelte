<script>
    import { LogOut, Camera  } from 'lucide-svelte';
    import { signout } from '$lib/pocketbase.svelte'
    import { currentUser, getImageUrl, updateProfile, updatePassword, updateVehicle, createVehicle } from '$lib/pocketbase.svelte';
    import { Payments } from '$lib/components/driver';
    import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

    const collectionType = 'drivers'
    const sizeLimitBytes = 7000000
    let profileUpdateLoading = $state(false)
    let passwordUpdateLoading = $state(false)
    let vehicleUpdateLoading = $state(false)

    const showPreview = (event) => {
        const target = event.target
        const files = target.files

        if (files.length > 0) {
            const src = URL.createObjectURL(files[0])
            const fileSize = files[0].size
            if (fileSize > sizeLimitBytes) {
                toast.error('File size exceeded 7MB')
                return
            }
            const preview = document.getElementById("avatar-preview") 
            preview.src = src
        }
    } 
    
    async function updatePasswordHandler(e) {
        passwordUpdateLoading = true
        e.preventDefault();
        const data = Object.fromEntries( await new FormData(e.target)); 
        const { success, message } = await updatePassword(collectionType, $currentUser.id, data);
        if (success) {            
            toast.success(message);
        } else {
            toast.error(message);
        }
        e.target.reset();
        passwordUpdateLoading = false
    }

    async function updateProfileHandler(e) {
        profileUpdateLoading = true
        e.preventDefault(); 
        const data = Object.fromEntries( await new FormData(e.target));
        const userAvatar = data['avatar']
        if( userAvatar.size === 0) {
            delete data['avatar']
        }  
        const { success, message } = await updateProfile(collectionType, $currentUser.id, data);
        if (success) {
            toast.success(message);
        } else {
            toast.error(message);
        }
        profileUpdateLoading = false
    }
 
    async function updateVehicleHandler(e) {
        vehicleUpdateLoading = true
        e.preventDefault();
        let data = Object.fromEntries( await new FormData(e.target));
        
        const vehicleId = $currentUser?.expand?.vehicles_via_driver?.id
        if (vehicleId) {
            const { success, message } = await updateVehicle(vehicleId, data);
            if (success) {
                toast.success(message);
            } else {
                toast.error(message);
            }
        } else {
            data['driver'] = $currentUser.id
            const { success, message, vehicleData } = await createVehicle(data);
            if (success) {
                let tempUser = $currentUser
                tempUser.expand.vehicles_via_driver = vehicleData
                currentUser.set(tempUser)
                toast.success(message);
            } else {
                toast.error(message);
            }
        } 
        vehicleUpdateLoading = false
    }

    function onUpdateSubscription(latest) { 
        let tempUser = $currentUser 
        tempUser.expand.subscriptions_via_driver = [latest]
        currentUser.set(tempUser)
    }

</script>

<div class="flex flex-col max-w-md w-full p-4 mt-16 mx-auto">
    <div class="divider mt-0">Profile</div>
    <form onsubmit={(e) => updateProfileHandler(e)} enctype="multipart/form-data" class="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm bg-gray-50 justify-center w-full">
        <!-- profile picture -->
        <div class="form-control relative">
            <div class="flex justify-center mb-2">
                <div class="avatar">
                    <div class="w-32 rounded-sm">
                      <img  id="avatar-preview" src={getImageUrl($currentUser, $currentUser?.avatar) ?? '/pfp-placeholder.jpg'} alt={$currentUser?.first_name}> 
                    </div>
                    <label class="absolute label bottom-0 right-0.5 hover:cursor-pointer" for="avatar">
                       <Camera class="fill-white" />
                    </label>
                </div>
            </div>
            <input id="avatar" hidden type="file" onchange={(event) => showPreview(event)} class="file-input file-input-bordered file-input-sm lg:file-input-md" name="avatar" accept="image/*" /> 
        </div>
        <div class="flex justify-center">
          <button type="button" onclick={() => signout()} class="btn btn-primary mt-2">
              <LogOut size={16}/>
              Signout
          </button>
      </div>

        <div class="mt-6 grid grid-cols-2 text-center">
            <div>
              <p class="text-xl font-bold text-gray-800">{$currentUser?.expand?.subscriptions_via_driver[0].rating ?? 0}</p>
              <p class="text-sm text-gray-500">Rating</p>
            </div>
            <div>
              <p class="text-xl font-bold text-gray-800">{$currentUser?.expand?.subscriptions_via_driver[0].trips ?? 0}</p>
              <p class="text-sm text-gray-500">Trips</p>
            </div> 
        </div>
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">First Name</span> 
            </div>
            <input name="first_name" value={$currentUser?.first_name ?? ''} type="text" class="input input-sm input-bordered w-full max-w-md" required/> 
        </label>

        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">Last Name</span> 
            </div>
            <input name="last_name" value={$currentUser?.last_name ?? ''} type="text" class="input input-sm input-bordered w-full max-w-md" required/> 
        </label>

        <button disabled={profileUpdateLoading} type="submit" class="btn btn-primary w-full mt-2">
          {#if profileUpdateLoading}
            <span class="loading loading-spinner loading-md"></span>
          {/if}
          Update Profile
        </button>
    </form>
    
     <Payments {onUpdateSubscription} />
 
    <div class="divider">Vehicle</div>
    <form onsubmit={(e) => updateVehicleHandler(e)} class="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm bg-gray-50 justify-center w-full">
        
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">Brand</span> 
            </div>
            <input name="brand" value={$currentUser?.expand?.vehicles_via_driver?.brand ?? ''} type="text" class="input input-sm input-bordered w-full max-w-md" required /> 
        </label>

        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">Model</span> 
            </div>
            <input value={$currentUser?.expand?.vehicles_via_driver?.model ?? ''} name="model" type="text" class="input input-sm input-bordered w-full max-w-md" required /> 
        </label>

        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">Color</span> 
            </div>
            <input value={$currentUser?.expand?.vehicles_via_driver?.color ?? ''} name="color" type="text" class="input input-sm input-bordered w-full max-w-md" required /> 
        </label>

        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">Plate</span> 
            </div>
            <input value={$currentUser?.expand?.vehicles_via_driver?.plate ?? ''} name="plate" type="text" class="input input-sm input-bordered w-full max-w-md" required /> 
        </label>
       
 
        <button type="submit" disabled={vehicleUpdateLoading} class="btn btn-primary w-full mt-2">
            {#if vehicleUpdateLoading}
                <span class="loading loading-spinner loading-md"></span>
            {/if}
            Update Vehicle
        </button>
    </form>

    <div class="divider">Change Password</div>
    <form onsubmit={(e) => updatePasswordHandler(e)} class="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm bg-gray-50 justify-center w-full">
        
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">Old Password</span> 
            </div>
            <input name="oldPassword" type="password" class="input input-sm input-bordered w-full max-w-md" required /> 
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">New Password</span> 
            </div>
            <input name="password" type="password" class="input input-sm input-bordered w-full max-w-md" required/> 
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">Confirm New Password</span> 
            </div>
            <input name="passwordConfirm" type="password" class="input input-sm input-bordered w-full max-w-md" required /> 
        </label>
 
        <button disabled={passwordUpdateLoading} type="submit" class="btn btn-primary w-full mt-2">
          {#if passwordUpdateLoading}
            <span class="loading loading-spinner loading-md"></span>
          {/if} 
          Update Password
        </button>
    </form>


<!-- 
    <div class="divider">Change Email</div>
    <form action="" class="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm bg-gray-50 justify-center w-full">
        
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">New Email</span> 
            </div>
            <input type="email" class="input input-sm input-bordered w-full max-w-md" /> 
        </label> 
 
        <button class="btn btn-primary w-full mt-2">Update Email</button>
    </form> -->
</div>
 