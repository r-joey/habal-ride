<script>
	import '../app.css';
	import { Toaster } from 'svelte-sonner'
	import { currentUser } from '$lib/pocketbase.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let { children } = $props();

 
	$effect(() => { 
		if (!$currentUser && ($page.url.pathname.startsWith('/r/home') || $page.url.pathname.startsWith('/r/account') || $page.url.pathname.startsWith('/r/history'))) {
			console.log('you are in a protected route and you are not logged in')
			goto('/r/signin')
		}

		if (!$currentUser && ($page.url.pathname.startsWith('/d/home') || $page.url.pathname.startsWith('/d/account') || $page.url.pathname.startsWith('/d/history'))) {
			console.log('you are in a protected route and you are not logged in')
			goto('/d/signin')
		}

		if ($currentUser && ($page.url.pathname.startsWith('/r/signin') || $page.url.pathname.startsWith('/r/signup') || $page.url.pathname.startsWith('/d/signin') || $page.url.pathname.startsWith('/d/signup'))) {
			console.log('you ared signed in and you are trying to access sign in page ') 
			if ($currentUser?.collectionName === 'riders') {
				goto('/r/home') 
			}
			if ($currentUser?.collectionName === 'drivers') {
				goto('/d/home') 
			}
		}

		if ($currentUser && $currentUser?.collectionName === 'riders' && ($page.url.pathname.startsWith('/d/home') || $page.url.pathname.startsWith('/d/account') || $page.url.pathname.startsWith('/d/history'))) {
			goto('/r/home') 
		}

		if ($currentUser && $currentUser?.collectionName === 'drivers' && ($page.url.pathname.startsWith('/r/home') || $page.url.pathname.startsWith('/r/account') || $page.url.pathname.startsWith('/r/history'))) {
			goto('/d/home') 
		}
	})
 
</script>
<Toaster closeButton  position="top-right" offset="180px" /> 
{@render children()}
