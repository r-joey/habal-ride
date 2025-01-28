<script> 
    import { MapPin, Camera, LogOut, Trash2 } from 'lucide-svelte';
    import { signout, currentUser, getImageUrl, updateProfile, updatePassword } from '$lib/pocketbase.svelte';
	import { toast } from 'svelte-sonner'; 
    import { Places } from '$lib/components/rider';
    const collectionType = 'riders'
    const sizeLimitBytes = 7000000 
    let profileUpdateLoading = $state(false)
    let passwordUpdateLoading = $state(false)

    let places = $state($currentUser?.expand?.places_via_rider ?? []) 

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


    // async function updateEmailHandler(e) {
    //     e.preventDefault();
    //     const data = Object.fromEntries( await new FormData(e.target));
    //     const { success, message } = await updateEmail(collectionType, $currentUser.id, data);
    //     if (success) {
    //         e.target.reset();
    //         toast.success(message);
    //     } else {
    //         toast.error(message);
    //     }
    // }

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


    function removePlaceFromLocal(place) {
        places = places.filter(p => p.id !== place.id)
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
                        <img id="avatar-preview" src={getImageUrl($currentUser, $currentUser?.avatar) ?? '/pfp-placeholder.jpg'} alt={$currentUser?.first_name} />
                    </div>
                    <label class="absolute label bottom-0 right-0.5 hover:cursor-pointer" for="avatar">
                       <Camera class="fill-white" />
                    </label>
                </div>
            </div>
            <input id="avatar" hidden type="file" onchange={(event) => showPreview(event)}  class="file-input file-input-bordered file-input-sm lg:file-input-md" name="avatar" accept="image/*" /> 
        </div>
        <div class="flex justify-center">
            <button type="button" onclick={() => signout()} class="btn btn-primary mt-2">
                <LogOut size={16}/>
                Signout
            </button>
        </div> 
        
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">First Name</span> 
            </div>
            <input name="first_name" value={$currentUser?.first_name ?? ''} type="text" class="input input-sm input-bordered w-full max-w-md" /> 
        </label>

        <label class="form-control w-full max-w-md">
            <div class="label">
              <span  class="label-text text-gray-500">Last Name</span> 
            </div>
            <input name="last_name" value={$currentUser?.last_name ?? ''} type="text" class="input input-sm input-bordered w-full max-w-md" /> 
        </label>


        <button disabled={profileUpdateLoading} type="submit" class="btn btn-primary w-full mt-2">
            {#if profileUpdateLoading}
                <span class="loading loading-spinner loading-md"></span>
            {/if}
            Update Profile
        </button>
    </form>

    <Places />
    
    <!-- <div class="divider">Places</div>
    <div class="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm bg-gray-50 justify-center w-full">
        
        {#each places as place }
                <Place {removePlaceFromLocal} place={place} />
        {/each}
       
        <button type="button" class="btn btn-primary w-full mt-2">Add</button>
    </div> -->


    <div class="divider">Change Password</div>
    <form onsubmit={(e) => updatePasswordHandler(e)} class="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm bg-gray-50 justify-center w-full">
        
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">Old Password</span> 
            </div>
            <input name="oldPassword" type="password" class="input input-sm input-bordered w-full max-w-md" /> 
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">New Password</span> 
            </div>
            <input name="password" type="password" class="input input-sm input-bordered w-full max-w-md" /> 
        </label>
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">Confirm New Password</span> 
            </div>
            <input name="passwordConfirm" type="password" class="input input-sm input-bordered w-full max-w-md" /> 
        </label>
 
        <button disabled={passwordUpdateLoading} type="submit" class="btn btn-primary w-full mt-2">
            {#if passwordUpdateLoading}
                <span class="loading loading-spinner loading-md"></span>
            {/if} 
            Update Password
        </button>
    </form>



    <!-- <div class="divider">Change Email</div>
    <form onsubmit={(e) => updateEmailHandler(e)} class="flex flex-col gap-2 border border-gray-300 p-4 rounded-sm bg-gray-50 justify-center w-full">
        
        <label class="form-control w-full max-w-md">
            <div class="label">
              <span class="label-text text-gray-500">New Email</span> 
            </div>
            <input name="email"  type="email" class="input input-sm input-bordered w-full max-w-md" /> 
        </label> 
 
        <button type="submit" class="btn btn-primary w-full mt-2">Update Email</button>
    </form> -->
</div>
 