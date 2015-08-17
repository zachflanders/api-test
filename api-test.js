if (Meteor.isClient) {

    var latlon = [];
    var query = '';
    var ecodistrict = new L.geoJson();
    $.ajax({
	dataType: 'json',
	url: '/ecodistrict.geojson',
	success: function(data){
	   $(data.features).each(function(key, data){
	       ecodistrict.addData(data);
	   });
	    console.log(ecodistrict);
	    var bbox = turf.extent(data);
	    console.log(bbox);
	    query = "?$where= loction_1.latitude between'" +bbox[1] +"' and '" + bbox[4] +"'";
      HTTP.get("https://data.kcmo.org/resource/kbzx-7ehe.json" + query, function(err, result){
    	   console.log(result);
    	   L.Icon.Default.imagePath = '/packages/fuatsengul_leaflet/images';
         var map = L.map('map',{zoomControl:false}).setView([39.0997, -94.5783], 13);
    	   L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    	      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    	   }).addTo(map);
    	   ecodistrict.addTo(map);
    	   result.data.forEach(function(entry, index){
    	      latlon = [entry.location_1.latitude, entry.location_1.longitude];
    		    L.marker(latlon).addTo(map).bindPopup(entry.description+', '+entry.from_date);
    	   });
    	   return result;
      });
	}
	});










}

if (Meteor.isServer) {
	console.log('hello from server');
}
