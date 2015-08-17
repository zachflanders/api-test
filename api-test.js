if (Meteor.isClient) {

    var latlon = [];
    var query = '';
    //load the geojson boundary file
    $.ajax({
	dataType: 'json',
	url: '/ecodistrict.geojson',
	success: function(ecodistrict){

	    //find the boundary box using turf
	    var bbox = turf.extent(ecodistrict);

	    //Write the query for the API endpoint using the boundary box
	    query = "?$where=within_box(location_1,"+bbox[3]+","+bbox[0]+","+bbox[1]+","+bbox[2]+")"; 

	    //Get the data from the endpoint using the query
	    HTTP.get("https://data.kcmo.org/resource/kbzx-7ehe.json" + query, function(err, result){

		//Console log the data so we can look at it
    		console.log(result);

		//Leaflet was getting confused about where the marker image files are located
    		L.Icon.Default.imagePath = '/packages/fuatsengul_leaflet/images';

		//Make the Map
		var map = L.map('map',{zoomControl:false});

		//Add the basemap layer
    		L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    		    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    		}).addTo(map);

		//Add the geojson boundary file
    		L.geoJson(ecodistrict).addTo(map);

		//Get the bounds of the geojson and fit map to the bounds
		var bounds = L.geoJson(ecodistrict).getBounds();
		map.fitBounds(bounds);


		//Determine whether each row of data is within the boundary and add it if it is
	   	result.data.forEach(function(entry, index){
    		    latlon = [entry.location_1.latitude, entry.location_1.longitude]
		    var point = L.marker(latlon).toGeoJSON();
		    if(turf.inside(point,ecodistrict.features[0])){
			L.geoJson(point).addTo(map).bindPopup(entry.description+', '+entry.from_date);
		    }
    		});
    		
	    });
	}
    });



}

if (Meteor.isServer) {
	console.log('hello from server');
}
