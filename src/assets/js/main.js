// Aquí se muestra el mapa 
var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -33.397, 
      lng: -70.644 },
    zoom: 15,
    mapTypeId: 'roadmap'
  });
  infoWindow = new google.maps.InfoWindow;

  // Aquí se nos pide la localización para buscarla en el mapa
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('Estás aquí');
      infoWindow.open(map);
      map.setCenter(pos);

      // Poniendo un marker en la ubicación del usuario
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Estás aquí'
      });
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
      
      // Creando el DOM (input de búsqueda)
      const input = document.getElementById('pac-input');
      const searchBox = new google.maps.places.SearchBox(input);
      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });
      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();      
        if (places.length === 0) {
          return;        
        }
        // Ésta opción borra los marcadores antiguos
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];      
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log('Returned place contains no geometry');
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };      
          // Creo un marcador para cada lugar
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));      
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }, function() {// Caso errores
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}