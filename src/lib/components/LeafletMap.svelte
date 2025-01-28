 
<script>
	import { onMount, onDestroy, setContext } from 'svelte'; 
	import { browser } from '$app/environment'; 
	import L from 'leaflet'; 
	import 'leaflet/dist/leaflet.css';
    import '@maplibre/maplibre-gl-leaflet';
    import 'maplibre-gl';
	import { LocateControl } from "leaflet.locatecontrol";
	import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

	
	// commented out for now, maybe will use routing in the future
	// import 'leaflet-routing-machine'
	// import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

    let { setMapCenter, mapClass, bounds, view, zoom, children } = $props();
	
	let centerMarker = $state(); 
	let map = $state(); 
	let mapElement; 
	const availableAttr = false
	const defaultView = { lat: 7.0814564509985685, lng: 125.57613983700874 }
	const defaultZoom = 11;
	if (browser) {
		onMount( () => {
			// if (!bounds && (!view || !zoom)) {
			// 	throw new Error('Must set either bounds, or view and zoom.');
			// }
			
			map = L.map(mapElement, { zoomControl: false })
			.setView(defaultView , defaultZoom)
			.on('move', () => { 
				centerMarker.setLatLng(map.getCenter());  
			})
			.on('moveend', () => { 
				setMapCenter(map.getCenter()); 
			})
			L.maplibreGL({
					style: 'https://tiles.openfreemap.org/styles/bright',
					// attribution: '<a href="https://openfreemap.org/">OpenFreeMap</a> | &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> | <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}).addTo(map)
			map.attributionControl.remove();
			
			const locateCtrlOpts = {
				keepCurrentZoomLevel : true,
				drawCircle: false,
				locateOptions: {
					enableHighAccuracy: true
				}
			}
			const locateCtrl = new LocateControl(locateCtrlOpts); 
			locateCtrl.addTo(map)
		 
			centerMarker = L.marker(map.getCenter(), { draggable: false }).addTo(map);
			
			// L.Routing.control({
			// 	waypoints: [
			// 		L.latLng(7.092303598803807, 125.61068048469312),
			// 		L.latLng(7.061904472951003, 125.59289788363851)
			// 	]
			// }).addTo(map);

			return () => {
				console.log('map destroyed');
				map.remove();
				map = undefined;
			}
		}); 

		setContext('map', {
			getMap: () => map
		});

	}

	$effect(() => {
		if (map) { 
			if (bounds) {
				map.fitBounds(bounds);
			} else if (view && zoom) { 
				map.setView(view, zoom); 
			} else if (view) {
				map.setView(view);
			}
		}
	}) 
  
</script>
 
<div class={mapClass} bind:this={mapElement}>
	<!-- {#if map}
		{@render children?.()}
	{/if} -->
</div>