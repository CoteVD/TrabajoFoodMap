// Vista splash con duración de 2s
window.onload = () => {
  setTimeout(function () {
    const courtainContainer = document.getElementById('courtainContainer');
    courtainContainer.style.visibility = 'hidden';
    courtainContainer.style.opacity = '0';
  }, 2000);
};
function initMap() { console.log('lib loaded') }

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
    radio: 800,
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
      // Muestra los resultados que hay en el mapa, de acuerdo al input
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
        // Se supone que para cada lugar entrega el nombre, un icono y la locación. No funciona.
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
          google.maps.event.addListener(markers, 'click', () => {
            infowindow.setContent(place.name);
            infowindow.open(map, markers);
          });
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
