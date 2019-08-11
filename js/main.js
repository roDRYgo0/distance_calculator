var myLatLng = { lat: 0.0, lng: 0.0 };

var destinos = document.getElementById('destinos')
var destino = document.getElementById('destino')

// Create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

// Create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();
// Create/Init map
var map = new google.maps.Map(document.getElementById('google-map'), {
    zoom: 2,
    center: {lat: 13, lng: -89},
    mapTypeId: google.maps.MapTypeId.ROADMAP
});
directionsDisplay.setMap(map);


// Bind the DirectionsRenderer to the map

// Define calcRoute function
function calcRoute() {
    if(destinos.length > 0){
        var waypts = []
        for (var i = 0; i < destinos.length; i++) {
            waypts.push({
            location: destinos[i].text,
            stopover: true
            });
        }
        waypts.pop()
        var request={
            origin: document.getElementById('origen').value,
            destination: destinos[destinos.length-1].text,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }
        directionsService.route(request, function(response, status) {
            if (status === 'OK') {
                console.log(response)
              directionsDisplay.setDirections(response);
              var route = response.routes[0];
              var distancia = ''
              var direcciones = ''
              var pasos = ''
              $('#distanciaBody').html(distancia)
              $('#direccionesBody').html(direcciones)
              // For each route, display summary information.
              for (var i = 0; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                distancia +=`
                <div class="card border-dark mb-3"">
                    <div class="card-header"><b>Segmento ${routeSegment}</b></div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><b>Origen: </b>${route.legs[i].start_address}</li>
                            <li class="list-group-item"><b>Destino: </b>${route.legs[i].end_address}</li>
                            <li class="list-group-item"><b>Tiempo: </b>${route.legs[i].duration.text}</li>
                            <li class="list-group-item"><b>Distancia: </b>${route.legs[i].distance.text}</l>
                        </ul>
                    </div>
                </div>
                `
                for(var e = 0; e < route.legs[i].steps.length; e++){
                    pasos += `
                        <div class="card text-white bg-success mb-3">
                            <div class="card-header row">
                                <div class="col-6">${route.legs[i].steps[e].duration.text}</div>
                                <div class="col-6">${route.legs[i].steps[e].distance.text}</div>
                            </div>
                            <div class="card-body">
                                <p class="card-text">${route.legs[i].steps[e].instructions}</p>
                            </div>
                        </div>
                    `
                }
                direcciones += `
                <div class="card">
                    <h5 class="card-header">Segmento ${routeSegment}</h5>
                    ${pasos}
                </div>
                `
                pasos = ''
              }
              $('#distanciaBody').html(distancia)
              $('#direccionesBody').html(direcciones)
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
    }else{
        Swal.fire({
            type: 'error',
            title: 'Sin destinos',
          })
    }
}

// Clear results

function clearRoute(){
    $('#origen').value = ''
    $('#destino').value = ''
    $('#destinos').html('')
    $('#distanciaBody').html('')
    $('#direccionesBody').html('')
    directionsDisplay.setDirections({ routes: [] });
    
}

// Create autocomplete objects for all inputs

var options = {
    types: ['(cities)']
}


//Agregar destino
function addDestino(destino){
    var option = document.createElement('option')
    option.text = destino
    destinos.add(option)
    this.destino.value = ''

}