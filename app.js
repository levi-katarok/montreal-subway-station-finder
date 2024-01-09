let map;
let directionsService;
let directionsRenderer;

let stationCoordinatesData = [
    {
        "name": "Bonaventure",
        "location": {
            "lat": 45.498457,
            "long": -73.566674
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Lucien-L'Allier",
        "location": {
            "lat": 45.494841,
            "long": -73.570804
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Villa Maria",
        "location": {
            "lat": 45.480294,
            "long": -73.619814
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Vend\u00f4me",
        "location": {
            "lat": 45.472892,
            "long": -73.603334
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Lionel-Groulx",
        "location": {
            "lat": 45.482832,
            "long": -73.579677
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Place-Saint-Henri ",
        "location": {
            "lat": 45.477015,
            "long": -73.586404
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "C\u00f4te-Vertu",
        "location": {
            "lat": 45.513804,
            "long": -73.683628
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Du Coll\u00e8ge Metro",
        "location": {
            "lat": 45.509414,
            "long": -73.674616
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "De la Savane",
        "location": {
            "lat": 45.49812,
            "long": -73.659853
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Namur",
        "location": {
            "lat": 45.495066,
            "long": -73.653115
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Plamondon",
        "location": {
            "lat": 45.495517,
            "long": -73.640756
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "C\u00f4te-Sainte-Catherine",
        "location": {
            "lat": 45.492449,
            "long": -73.632773
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Snowdon",
        "location": {
            "lat": 45.48586,
            "long": -73.627667
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Georges-Vanier",
        "location": {
            "lat": 45.48884,
            "long": -73.576511
        },
        "line": "#icon-503-DB4436"
    },
    {
        "name": "Angrignon",
        "location": {
            "lat": 45.446643,
            "long": -73.604622
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Monk",
        "location": {
            "lat": 45.451144,
            "long": -73.593227
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Jolicoeur",
        "location": {
            "lat": 45.456654,
            "long": -73.581768
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Verdun",
        "location": {
            "lat": 45.459107,
            "long": -73.571726
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "De l'\u00c9glise",
        "location": {
            "lat": 45.462598,
            "long": -73.567027
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Lasalle",
        "location": {
            "lat": 45.47086,
            "long": -73.56662
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Charlevoix",
        "location": {
            "lat": 45.478029,
            "long": -73.569388
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Atwater",
        "location": {
            "lat": 45.48969,
            "long": -73.586275
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Guy-Concordia",
        "location": {
            "lat": 45.495218,
            "long": -73.579741
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Peel",
        "location": {
            "lat": 45.500729,
            "long": -73.574978
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "McGill",
        "location": {
            "lat": 45.50421,
            "long": -73.571426
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Place-des-Arts",
        "location": {
            "lat": 45.507902,
            "long": -73.568433
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Saint-Laurent",
        "location": {
            "lat": 45.510806,
            "long": -73.564625
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Berri-UQAM",
        "location": {
            "lat": 45.515338,
            "long": -73.56103
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Beaudry",
        "location": {
            "lat": 45.519089,
            "long": -73.555826
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Papineau",
        "location": {
            "lat": 45.523586,
            "long": -73.551771
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Frontenac",
        "location": {
            "lat": 45.533289,
            "long": -73.551985
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Pr\u00e9fontaine",
        "location": {
            "lat": 45.541676,
            "long": -73.554196
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Joliette",
        "location": {
            "lat": 45.546987,
            "long": -73.551299
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Pie-IX",
        "location": {
            "lat": 45.553854,
            "long": -73.551771
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Viau",
        "location": {
            "lat": 45.561321,
            "long": -73.547019
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Assomption",
        "location": {
            "lat": 45.569397,
            "long": -73.546953
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Cadillac",
        "location": {
            "lat": 45.576869,
            "long": -73.546599
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Langelier",
        "location": {
            "lat": 45.582748,
            "long": -73.543103
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Radisson",
        "location": {
            "lat": 45.588898,
            "long": -73.539466
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Honor\u00e9-Beaugrand",
        "location": {
            "lat": 45.596713,
            "long": -73.535259
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "C\u00f4te-des-Neiges",
        "location": {
            "lat": 45.496436,
            "long": -73.622904
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Universit\u00e9-de-Montr\u00e9al",
        "location": {
            "lat": 45.502285,
            "long": -73.618161
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Edouard-Montpetit",
        "location": {
            "lat": 45.509956,
            "long": -73.612132
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Outremont",
        "location": {
            "lat": 45.520105,
            "long": -73.614834
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Acadie",
        "location": {
            "lat": 45.523383,
            "long": -73.623569
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Parc",
        "location": {
            "lat": 45.530343,
            "long": -73.62417
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Square-Victoria",
        "location": {
            "lat": 45.50097,
            "long": -73.560654
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Place-d'Armes",
        "location": {
            "lat": 45.505986,
            "long": -73.559797
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Square-Victoria",
        "location": {
            "lat": 45.500962,
            "long": -73.560654
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Champ-de-Mars",
        "location": {
            "lat": 45.510196,
            "long": -73.556631
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Sherbrooke",
        "location": {
            "lat": 45.518895,
            "long": -73.56898
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Mont-Royal",
        "location": {
            "lat": 45.524765,
            "long": -73.581554
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Laurier",
        "location": {
            "lat": 45.528027,
            "long": -73.588066
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Rosemont",
        "location": {
            "lat": 45.531801,
            "long": -73.597787
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Beaubien",
        "location": {
            "lat": 45.535001,
            "long": -73.604826
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Jarry",
        "location": {
            "lat": 45.54338,
            "long": -73.62934
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Cr\u00e9mazie",
        "location": {
            "lat": 45.545974,
            "long": -73.638256
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Sauv\u00e9",
        "location": {
            "lat": 45.550826,
            "long": -73.655906
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Henri-Bourassa",
        "location": {
            "lat": 45.554237,
            "long": -73.667783
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "De Castelneau",
        "location": {
            "lat": 45.535108,
            "long": -73.619985
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Jean-Talon",
        "location": {
            "lat": 45.538805,
            "long": -73.613676
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Fabre",
        "location": {
            "lat": 45.546424,
            "long": -73.608012
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "D'Iberville",
        "location": {
            "lat": 45.553938,
            "long": -73.602046
        },
        "line": "#icon-503-DB4436-nodesc"
    },
    {
        "name": "Saint-Michel",
        "location": {
            "lat": 45.558925,
            "long": -73.599601
        },
        "line": "#icon-503-DB4436-nodesc"
    }
]

// Function to load JSON data
function loadStationData() {
    stationCoordinates = stationCoordinatesData.map(station => {
        return {
            name: station.name,
            lat: station.location.lat,
            lng: station.location.long // Ensure this matches the JSON structure
        };
    });
}


function initMap() {
    const montreal = new google.maps.LatLng(45.5017, -73.5673);
    map = new google.maps.Map(document.getElementById('map'), {
        center: montreal,
        zoom: 12,

    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    loadStationData();
}

function chunkArray(array, size) {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
}


function escapeApostrophe(stationName) {
    return stationName.replace(/'/g, "\\'");
}
function findStations() {
    const locationInput = document.getElementById('autocomplete').value;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': locationInput }, function (results, status) {
        if (status === 'OK') {

            map.setCenter(results[0].geometry.location);
            const origin = results[0].geometry.location;
            // document.getElementById('results').innerHTML = '';

            calculateDistances(origin, "WALKING");
            calculateDistances(origin, "BICYCLING");
            scrollToFirstResult();

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
function scrollToFirstResult() {
    const firstResultElement = document.getElementById('results').querySelector('.result-section');
    if (firstResultElement) {
        firstResultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


function calculateDistances(origin, travelMode) {
    const chunkSize = 25; // Google Maps API limit
    const stationChunks = chunkArray(stationCoordinates, chunkSize);
    let allResults = [];
    let completedRequests = 0; // Counter to track completed requests
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
                completedRequests++; // Increment the counter for each completed request

                // Check if all requests have been processed
                if (completedRequests === stationChunks.length) {
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
        let result = new google.maps.LatLng(station.lat, station.lng);
        return result;
    } else {
        console.error('Station not found:', stationName);
        return null;
    }
}
function displayCombinedResults(allResults, travelMode) {
    let resultsListContainerId = travelMode.toLowerCase() === 'walking' ? 'walking-results-list' : 'bicycling-results-list';
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
                <button onclick="displayDirections('${escapeApostrophe(allResults[i].station)}', '${travelMode}')">Directions</button>
            </p>`;
        }
    }
}


function displayDirections(stationName, travelMode) {
    const originAddress = document.getElementById('autocomplete').value;
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

function initAutocomplete() {
    // Assuming initMap is already defined and called on window load
    initMap();

    // Create the autocomplete object
    var autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'), { types: ['geocode'] }
    );

    // Bind the map's bounds (viewport) to the autocomplete object
    autocomplete.bindTo('bounds', map);

    // Set up the event listener to get the selected option
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a place that was not suggested and pressed Enter
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, present it on a map
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }

        // You can add additional code here to handle the selected place,
        // like displaying information or marking it on the map
    });
}


window.onload = initMap;
window.onload = initAutocomplete;



