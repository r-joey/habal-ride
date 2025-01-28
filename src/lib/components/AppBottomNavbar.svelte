<script> 
	import { Home, History, User } from "lucide-svelte";
	import { page } from '$app/stores';  
	const { userType } = $props()


	let menuItems = $state([
		{
			name: "History",
			icon: History,	
			path: `/${userType}/history/`
		},
		{
			name: "Home",
			icon: Home,
			path: `/${userType}/home/`
		}, 
		{
			name: "Account",
			icon: User,
			path: `/${userType}/account/`
		}
	])

	if  (userType === 'd') {
		menuItems = [
			{
				name: "Home",
				icon: Home,
				path: `/${userType}/home/`
			}, 
			{
				name: "Account",
				icon: User,
				path: `/${userType}/account/`
			}
		]
	}
</script>


{#snippet icon(Icon)}
	<Icon size={18} />
{/snippet}

<nav class="btm-nav btm-nav-md border-t shadow-md border-gray-200">
	{#each menuItems as item}
		<a href={item.path} class={`${$page.url.pathname === item.path ? 'text-black active' : 'text-gray-500'}`}>
			{@render icon(item.icon)}
			<span class="btm-nav-label">{item.name}</span>
		</a>
	{/each} 
</nav>