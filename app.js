let map;
let directionsService;
let directionsRenderer;

let subwayStations = [
    "Angrignon",
    "Monk",
    "Jolicoeur",
    "Verdun",
    "De L'Église",
    "LaSalle",
    "Charlevoix",
    "Lionel-Groulx",
    "Atwater",
    "Guy–Concordia",
    "Peel",
    "McGill",
    "Place-des-Arts",
    "Saint-Laurent",
    "Berri–UQAM",
    "Beaudry",
    "Papineau",
    "Frontenac",
    "Préfontaine",
    "Joliette",
    "Pie-IX",
    "Viau",
    "Assomption",
    "Cadillac",
    "Langelier",
    "Radisson",
    "Honoré-Beaugrand",
    "Côte-Vertu",
    "Du Collège",
    "De La Savane",
    "Namur",
    "Plamondon",
    "Côte-Sainte-Catherine",
    "Snowdon",
    "Villa-Maria",
    "Vendôme",
    "Place-Saint-Henri",
    "Georges-Vanier",
    "Lucien-L'Allier",
    "Bonaventure",
    "Square-Victoria–OACI",
    "Place-d'Armes",
    "Champ-de-Mars",
    "Sherbrooke",
    "Mont-Royal",
    "Laurier",
    "Rosemont",
    "Beaubien",
    "Jean-Talon",
    "Jarry",
    "Crémazie",
    "Sauvé",
    "Henri-Bourassa",
    "Cartier",
    "De La Concorde",
    "Montmorency",
    "Jean-Drapeau",
    "Longueuil–Université-de-Sherbrooke",
    "Côte-des-Neiges",
    "Université-de-Montréal",
    "Édouard-Montpetit",
    "Outremont",
    "Acadie",
    "Parc",
    "De Castelnau",
    "Fabre",
    "D'Iberville",
    "Saint-Michel"
]

let stationCoordinates = [];


function initMap() {
    const montreal = new google.maps.LatLng(45.5017, -73.5673);
    map = new google.maps.Map(document.getElementById('map'), {
        center: montreal,
        zoom: 12
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    geocodeStations();
}

function chunkArray(array, size) {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
}
function geocodeStations() {
    const geocoder = new google.maps.Geocoder();

    subwayStations.forEach(station => {
        geocoder.geocode({ 'address': station + ', Montreal', 'region': 'CA' }, function (results, status) {
            if (status === 'OK') {
                stationCoordinates.push({
                    name: station,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                });
                console.log(station, results[0].geometry.location.lat(), results[0].geometry.location.lng());
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    });
}

function findStations() {
    const locationInput = document.getElementById('location-input').value;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': locationInput }, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            const origin = results[0].geometry.location;
            // document.getElementById('results').innerHTML = '';

            calculateDistances(origin, "WALKING");
            calculateDistances(origin, "BICYCLING");
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}



function calculateDistances(origin, travelMode) {
    const chunkSize = 25; // Google Maps API limit
    const stationChunks = chunkArray(stationCoordinates, chunkSize);
    let allResults = [];

    stationChunks.forEach((chunk, index) => {
        const destinations = chunk.map(station => new google.maps.LatLng(station.lat, station.lng));

        const distanceMatrixService = new google.maps.DistanceMatrixService();
        distanceMatrixService.getDistanceMatrix({
            origins: [origin],
            destinations: destinations,
            travelMode: travelMode,
        }, function (response, status) {
            if (status === 'OK') {
                const results = processDistanceResults(response, chunk, travelMode);
                allResults = allResults.concat(results);

                // Check if all chunks are processed
                if (index === stationChunks.length - 1) {
                    displayCombinedResults(allResults, travelMode);
                }
            } else {
                alert('Error was: ' + status);
            }
        });
    });
}

function processDistanceResults(response, chunk, travelMode) {
    const distances = response.rows[0].elements;
    return chunk.map((station, i) => ({
        station: station.name,
        distance: distances[i].distance.text,
        duration: distances[i].duration.text,
        travelMode: travelMode
    }));
}

function getStationLatLng(stationName) {
    const station = stationCoordinates.find(s => s.name === stationName);
    if (station) {
        console.log('Before sending coordinates:', station.lat, station.lng);
        let result = new google.maps.LatLng(station.lat, station.lng);
        console.log('LatLng Object:', result);
        console.log('Latitude:', result.lat());
        console.log('Longitude:', result.lng());
        return result;
    } else {
        console.error('Station not found:', stationName);
        return null;
    }
}
function displayCombinedResults(allResults, travelMode) {
    console.log('travel mode', travelMode, 'allResults', allResults);
    let resultsListContainerId = travelMode.toLowerCase() === 'walking' ? 'walking-results-list' : 'bicycling-results-list';
    console.log('resultsListContainerId', resultsListContainerId);
    let resultsListContainer = document.getElementById(resultsListContainerId);
    if (!resultsListContainer) {
        console.error('Results list container not found for:', resultsListContainerId);
        return; // Exit the function if the container is not found
    }
    // if (!resultsContainer) {
    //     resultsContainer = document.createElement('div');
    //     resultsContainer.id = 'results-' + travelMode.toLowerCase();
    //     resultsContainer.className = 'result-section';
    //     document.getElementById('results').appendChild(resultsContainer);
    // }
    resultsListContainer.innerHTML = '';


    // Clear previous results in the specific container
    // resultsContainer.innerHTML = `<h3>Top 3 Stations by ${travelMode}</h3>`;

    // Sort and display only the top 3 results
    allResults.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    for (let i = 0; i < 3; i++) {
        if (allResults[i]) {
            resultsListContainer.innerHTML += `
                <p>
                    ${allResults[i].station}: ${allResults[i].distance}, ${allResults[i].duration}
                    <button onclick="displayDirections('${allResults[i].station}', '${travelMode}')">Directions</button>
                </p>`;
        }
    }
}


function displayDirections(stationName, travelMode) {
    const originAddress = document.getElementById('location-input').value;
    console.log('Origin address:', originAddress, 'Station name:', stationName, 'Travel mode:', travelMode);
    document.querySelectorAll('.result-section p').forEach(p => {
        p.classList.remove('selected-direction');
    });

    // Then, add highlight to the selected item
    const resultsContainer = document.getElementById('results-' + travelMode.toLowerCase());
    const paragraphs = resultsContainer.getElementsByTagName('p');
    for (let p of paragraphs) {
        if (p.textContent.includes(stationName)) {
            p.classList.add('selected-direction');
            break; // Assuming stationName is unique, stop after finding the first match
        }
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': originAddress }, function (results, status) {
        if (status === 'OK') {
            const origin = results[0].geometry.location;
            const destination = getStationLatLng(stationName);

            console.log('Origin lat', origin.lat(), 'Origin lng', origin.lng());
            if (destination) {
                console.log('Destination lat', destination.lat(), 'Destination lng', destination.lng());
            } else {
                console.error("Destination coordinates not found.");
                return;
            }

            const request = {
                origin: origin,
                destination: destination,
                travelMode: travelMode
            };

            directionsService.route(request, function (response, status) {
                if (status == 'OK') {
                    directionsRenderer.setDirections(response);
                } else {
                    alert('Directions request failed due to ' + status);
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


window.onload = initMap;


