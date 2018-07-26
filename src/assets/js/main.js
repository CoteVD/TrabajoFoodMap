// Vista splash con duración de 2s
window.onload = () => {
  setTimeout(function () {
    const courtainContainer = document.getElementById('courtainContainer');
    courtainContainer.style.visibility = 'hidden';
    courtainContainer.style.opacity = '0';
  }, 2000);
};

// Aquí se muestra el mapa 
let map;
let infoWindow;
let pos;
let marker;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -33.397,
      lng: -70.644
    },
    zoom: 15,
    radio: 2000,
    mapTypeId: 'roadmap'
  });
  infoWindow = new google.maps.InfoWindow;

  // Aquí se nos pide la localización para buscarla en el mapa
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('Estás aquí');
      infoWindow.open(map);
      map.setCenter(pos);

      // Poniendo un marker en la ubicación del usuario
      marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Estás aquí'
      });

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: El servicio de geolocalización ha fallado.' :
          'Error: El browser no soporta geolocalización.');
        infoWindow.open(map);
      }

      // Creando el DOM (input de búsqueda)
      const input = document.getElementById('pac-input');
      const searchBox = new google.maps.places.SearchBox(input);
      // Muestra los resultados que hay en el mapa mostrado, de acuerdo al input
      map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
      });
      var markers = [];
      searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length === 0) {
          return;
        }
        // Ésta opción borra los marcadores antiguos
        markers.forEach(function (marker) {
          marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          console.log(place);
          if (!place.geometry) {
            console.log('Error: el lugar no tiene datos.');
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
    }, function () {// Caso errores
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

/* // Geolocalización.
var map; 
var infoWindow;
var marker;
var pos;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -33.397, lng: -70.644 },
    zoom: 15,
    radius: 2000
  });
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
      // Marcadores básicos.
      marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Estás aquí'
      });
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function initAutocomplete() {
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        radius: 5000
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
*/