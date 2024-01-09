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

let lineStrings = [
    {
        "name": "Verte / Green",
        "styleUrl": "#line-33CC00-7000",
        "color": "#33CC00",
        "coordinates": [
            {
                "lat": 45.596713,
                "lng": -73.535313
            },
            {
                "lat": 45.588845,
                "lng": -73.539518
            },
            {
                "lat": 45.582658,
                "lng": -73.543124
            },
            {
                "lat": 45.576802,
                "lng": -73.546685
            },
            {
                "lat": 45.569321,
                "lng": -73.546987
            },
            {
                "lat": 45.561239,
                "lng": -73.547072
            },
            {
                "lat": 45.553817,
                "lng": -73.551793
            },
            {
                "lat": 45.546875,
                "lng": -73.551277
            },
            {
                "lat": 45.541615,
                "lng": -73.554282
            },
            {
                "lat": 45.533199,
                "lng": -73.552051
            },
            {
                "lat": 45.523457,
                "lng": -73.551749
            },
            {
                "lat": 45.519038,
                "lng": -73.555913
            },
            {
                "lat": 45.515278,
                "lng": -73.561105
            },
            {
                "lat": 45.510767,
                "lng": -73.564667
            },
            {
                "lat": 45.507911,
                "lng": -73.568573
            },
            {
                "lat": 45.50421,
                "lng": -73.571577
            },
            {
                "lat": 45.500722,
                "lng": -73.575052
            },
            {
                "lat": 45.495218,
                "lng": -73.579817
            },
            {
                "lat": 45.489651,
                "lng": -73.58634
            },
            {
                "lat": 45.482731,
                "lng": -73.579688
            },
            {
                "lat": 45.477947,
                "lng": -73.56943
            },
            {
                "lat": 45.470815,
                "lng": -73.566642
            },
            {
                "lat": 45.462538,
                "lng": -73.56707
            },
            {
                "lat": 45.458987,
                "lng": -73.571792
            },
            {
                "lat": 45.456639,
                "lng": -73.581877
            },
            {
                "lat": 45.446402,
                "lng": -73.604406
            }
        ]
    },
    {
        "name": "Orange / Orange",
        "styleUrl": "#line-FF6600-5000",
        "color": "#FF6600",
        "coordinates": [
            {
                "lat": 45.512962,
                "lng": -73.683586
            },
            {
                "lat": 45.508994,
                "lng": -73.67483
            },
            {
                "lat": 45.497925,
                "lng": -73.659381
            },
            {
                "lat": 45.494675,
                "lng": -73.652859
            },
            {
                "lat": 45.495398,
                "lng": -73.640842
            },
            {
                "lat": 45.492029,
                "lng": -73.632259
            },
            {
                "lat": 45.485289,
                "lng": -73.62728
            },
            {
                "lat": 45.479872,
                "lng": -73.6199
            },
            {
                "lat": 45.472411,
                "lng": -73.603249
            },
            {
                "lat": 45.476743,
                "lng": -73.586596
            },
            {
                "lat": 45.483122,
                "lng": -73.580073
            },
            {
                "lat": 45.489502,
                "lng": -73.57664
            },
            {
                "lat": 45.494796,
                "lng": -73.57149
            },
            {
                "lat": 45.498406,
                "lng": -73.566685
            },
            {
                "lat": 45.501533,
                "lng": -73.560847
            },
            {
                "lat": 45.506227,
                "lng": -73.559818
            },
            {
                "lat": 45.510437,
                "lng": -73.556556
            },
            {
                "lat": 45.515489,
                "lng": -73.561363
            },
            {
                "lat": 45.518495,
                "lng": -73.56943
            },
            {
                "lat": 45.524509,
                "lng": -73.581619
            },
            {
                "lat": 45.527757,
                "lng": -73.588142
            },
            {
                "lat": 45.531725,
                "lng": -73.598099
            },
            {
                "lat": 45.53858,
                "lng": -73.613547
            },
            {
                "lat": 45.543148,
                "lng": -73.629856
            },
            {
                "lat": 45.545912,
                "lng": -73.638439
            },
            {
                "lat": 45.550601,
                "lng": -73.656291
            },
            {
                "lat": 45.554448,
                "lng": -73.667964
            }
        ]
    },
    {
        "name": "Bleue / Blue",
        "styleUrl": "#line-33CCFF-5000",
        "color": "#33CCFF",
        "coordinates": [
            {
                "lat": 45.559136,
                "lng": -73.599815
            },
            {
                "lat": 45.553848,
                "lng": -73.602219
            },
            {
                "lat": 45.546154,
                "lng": -73.608226
            },
            {
                "lat": 45.53882,
                "lng": -73.613892
            },
            {
                "lat": 45.535212,
                "lng": -73.620243
            },
            {
                "lat": 45.530282,
                "lng": -73.624534
            },
            {
                "lat": 45.523428,
                "lng": -73.623847
            },
            {
                "lat": 45.519699,
                "lng": -73.61475
            },
            {
                "lat": 45.510075,
                "lng": -73.612346
            },
            {
                "lat": 45.502496,
                "lng": -73.618697
            },
            {
                "lat": 45.496481,
                "lng": -73.62316
            },
            {
                "lat": 45.485891,
                "lng": -73.627796
            }
        ]
    },
    {
        "name": "Jaune / Yellow",
        "styleUrl": "#line-FFFF33-5000",
        "color": "#FFFF33",
        "coordinates": [
            {
                "lat": 45.515158,
                "lng": -73.561105
            },
            {
                "lat": 45.512332,
                "lng": -73.535829
            },
            {
                "lat": 45.525441,
                "lng": -73.521967
            }
        ]
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

let lineStringPolylines = [];

function createPolylines() {
    lineStrings.forEach((lineString) => {
        let polyline = new google.maps.Polyline({
            path: lineString.coordinates,
            geodesic: true,
            strokeColor: lineString.color,
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: map // Initially not displayed
        });
        lineStringPolylines.push({ name: lineString.name, polyline: polyline });
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
    createPolylines();
    createToggleButtons();
}

function createToggleButtons() {
    const buttonsContainer = document.getElementById('buttonsContainer'); // Assuming you have a container with this ID

    lineStringPolylines.forEach((lineString) => {
        let button = document.createElement("button");
        button.style.backgroundColor = lineString.polyline.strokeColor; // Style button with line color
        button.style.color = 'black'; // Set text color to black
        button.innerHTML = "Toggle " + lineString.name;
        button.addEventListener('click', function () {
            toggleOverlay(lineString.polyline);
        });
        buttonsContainer.appendChild(button); // Append to a specific container
    });
}

function toggleOverlay(polyline) {
    if (polyline.getMap()) {
        polyline.setMap(null);
    } else {
        polyline.setMap(map);
    }
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
        findStations();

        // You can add additional code here to handle the selected place,
        // like displaying information or marking it on the map
    });
}


window.onload = initMap;
window.onload = initAutocomplete;



