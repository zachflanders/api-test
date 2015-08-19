if (Meteor.isClient) {

    var geoJsonToWKT = function(geoJson){
	console.log(geoJson);
	var latlonArray = geoJson.geometries[0].coordinates[0];
	var wkt = "MULTIPOLYGON(((";
	latlonArray.forEach(function(entry){
	    console.log(entry);
	    wkt = wkt + entry[0].toFixed(5)+"+"+ entry[1].toFixed(5)+",";
	    
	});
	wkt = wkt.substring(0, wkt.length-1);
	wkt = wkt+")))";
	console.log(wkt);
	return wkt;
    };

    var latlon = [];
    var query = '';
    //load the geojson boundary file
    $.ajax({
	dataType: 'json',
	url: '/ecodistrict.geojson',
	success: function(ecodistrict){

	    console.log(ecodistrict);
	    var districtWKT = geoJsonToWKT(ecodistrict);

	    //find the boundary box using turf
	    var bbox = turf.extent(ecodistrict);

	    //Write the query for the API endpoint using the boundary box
	    query = "?$where=within_polygon(location_1,'"+districtWKT +"')"; 

	    //Get the data from the endpoint using the query
	    HTTP.get("https://data.kcmo.org/resource/geta-wrqs.json" + query, function(err, result){

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

		//Grab the lat lons of each entry and add it to the mal
	   	result.data.forEach(function(entry, index){
    		    latlon = [entry.location_1.coordinates[1], entry.location_1.coordinates[0]];
		    L.marker(latlon).addTo(map);
		});
    		
	    });
	}
    });
}

if (Meteor.isServer) {
	console.log('hello from server');
}
