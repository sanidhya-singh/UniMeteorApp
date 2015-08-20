Template.mapTest.helpers({
  exampleMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 20
      };
    }
  }
});

walkedPath = [];
var positionListenerOptions = {
  enableHighAccuracy: true,
  timeout: 1000
}

Template.mapTest.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready('exampleMap', function(map) {
    // Add a marker to the map once it's ready
    if (navigator.geolocation) {
          console.log('called');
          elevator = new google.maps.ElevationService();
          navigator.geolocation.watchPosition(function (position) {
            console.log(position);
            walkedPath.push({lat: position.coords.latitude, lng: position.coords.longitude});
            var path = new google.maps.Polyline({
              path: walkedPath,
              geodesic: true,
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 5
            });
            path.setMap(map.instance);
            map.instance.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
            getElevation(position.coords);
            if(walkedPath.length <= 1) {
              var contentString = 'You started here';
              var infowindow = new google.maps.InfoWindow({
                content: contentString
              });
              console.log(walkedPath[0]);
              var marker = new google.maps.Marker({
                position: {lat: walkedPath[0].lat, lng: walkedPath[0].lng},
                map: map.instance,
                title: 'Starting Position',
                label: 'S'
              });
            }
          }, function error(err) {
              console.log('error: ' + err.message);
          }, positionListenerOptions);
      } else {
          alert("Geolocation is not supported by this browser.");
      }
  });
});

getElevation = function(currentLocation) {
  var locations = [];
  var latLng = new google.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
  locations.push(latLng);
  var positionalRequest = {'locations': locations};
  elevator.getElevationForLocations(positionalRequest, function(results, status) {
    if (status == google.maps.ElevationStatus.OK) {
      if (results[0]) {
         document.getElementById('elevation').innerHTML = 'Floor ' + (Math.floor((results[0].elevation - 201.0)/3.35));
      }
    }
  });
}
