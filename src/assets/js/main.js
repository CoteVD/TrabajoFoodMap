var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.45694, lng: -70.64827},
    zoom: 15
  });
}