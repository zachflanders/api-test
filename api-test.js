if (Meteor.isClient) {

    var latlon = [];
    var query = '';
    $.ajax({
	dataType: 'json',
	url: '/ecodistrict.geojson',
	success: function(ecodistrict){
	    console.log(ecodistrict);
	    var bbox = turf.extent(ecodistrict);
	    console.log(bbox);
	    query = "?$where=within_box(location_1,"+bbox[3]+","+bbox[0]+","+bbox[1]+","+bbox[2]+")"; 
	    HTTP.get("https://data.kcmo.org/resource/kbzx-7ehe.json" + query, function(err, result){
    		console.log(result);
    		L.Icon.Default.imagePath = '/packages/fuatsengul_leaflet/images';
		var map = L.map('map',{zoomControl:false}).setView([39.0997, -94.5783], 13);
    		L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    		    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    		}).addTo(map);
    		L.geoJson(ecodistrict).addTo(map);
	  
	  
    		result.data.forEach(function(entry, index){
    		    latlon = [entry.location_1.latitude, entry.location_1.longitude]
		    console.log(L.marker(latlon).toGeoJSON());
		    var point = L.marker(latlon).toGeoJSON();
		    console.log(point);
		    console.log(turf.inside(point, ecodistrict.features[0]));
		   if(turf.inside(point,ecodistrict.features[0])){
			L.geoJson(point).addTo(map).bindPopup(entry.description+', '+entry.from_date);
		    }
    		});
    		return result;
	    });
	}
    });



}

if (Meteor.isServer) {
	console.log('hello from server');
}
