// Vista splash con duración de 2s
window.onload = () => {
  setTimeout(function () {
    const courtainContainer = document.getElementById('courtainContainer');
    courtainContainer.style.visibility = 'hidden';
    courtainContainer.style.opacity = '0';
  }, 2000);
};
function initMap() { console.log('lib loaded') }

let map;
let infoWindow;
let service;
let pos;
let marker;

// Aquí se muestra el mapa 
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -33.397,
      lng: -70.644,
    },
    zoom: 15,
    mapTypeId: 'roadmap'
  });
  infoWindow = new google.maps.InfoWindow;
  service = new google.maps.places.PlacesService(map);

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

      // Poniendo un marker en la ubicación del usuario, está un poco corrido
      let image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
      marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: image,
        title: 'Estás aquí'
      });

      // Funcion en caso de errores para obtener la Geolocación o que el navegador no la soporte 
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: El servicio de geolocalización ha fallado.' :
          'Error: El browser no soporta geolocalización.');
        infoWindow.open(map);
      }

      // Creando el input de búsqueda
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

        //Borra los markers antiguos (no funciona con los nuevos iconos con info)
        markers.forEach(function (marker) {
          marker.setMap(null);
        });

        // Para cada lugar entrega el nombre
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          console.log(place);
          if (!place.geometry) {
            console.log('Error: el lugar no tiene datos.');
            return;
          }

          //Información de los restaurants al clickear sobre el marcador
          service.getDetails({
            placeId: place.place_id,
          }, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              /* Intento fallido de resetear los markers
              if (place.length !== 0) {
                markers.forEach(function(marker) {
                  marker.setMap(null);
                })
              }*/
              //Le da forma al icono, como un cuchillo y tenedor
              var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
              };
              //El marcador en sí, ubicandolo en el mapa  
              var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                icon: icon
              });
              //Al clickear, da la información del restaurante; está un poco corrido del ícono
              google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<div>' + 'Nombre: ' + place.name + '<br>' +
                  'Calificación: ' + place.rating + '<br>' + 'Dirección: ' + place.formatted_address + '</div>');
                infoWindow.open(map, this);
              });
            }
          });
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
      // Caso errores
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}