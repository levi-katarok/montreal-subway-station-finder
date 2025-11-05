// ============================================================================
// Montreal Subway Explorer - Enhanced Edition
// Features: Accessibility, Bilingual, Line Colors, Favorites, Transfer Stations
// ============================================================================

// Global Variables
let map;
let directionsService;
let directionsRenderer;
let currentLanguage = 'en'; // Default to English
let currentLocation = null;
let lastSearchedAddress = '';

// ============================================================================
// TRANSLATIONS
// ============================================================================

const translations = {
    en: {
        headerTitle: 'Montreal Subway Explorer',
        headerSubtitle: 'Find the nearest metro stations - walk or bike!',
        langButton: 'FR',
        searchPlaceholder: 'Enter a location...',
        accessibleLabel: 'Accessible Only',
        favoritesLabel: 'Favorites',
        toggleLinesLabel: 'Toggle Metro Lines:',
        walkingTitle: 'Walking Stations',
        bikingTitle: 'Biking Stations',
        favoritesModalTitle: 'My Favorite Locations',
        noFavoritesText: 'No favorite locations yet. Search for a location and click the star to save it!',
        directionsButton: 'Directions',
        removeButton: 'Remove',
        transferStation: 'Transfer Station',
        accessible: 'Accessible',
        lines: 'Lines',
        toggleGreen: 'Toggle Green Line',
        toggleOrange: 'Toggle Orange Line',
        toggleBlue: 'Toggle Blue Line',
        toggleYellow: 'Toggle Yellow Line',
    },
    fr: {
        headerTitle: 'Explorateur du Métro de Montréal',
        headerSubtitle: 'Trouvez les stations de métro les plus proches - à pied ou à vélo!',
        langButton: 'EN',
        searchPlaceholder: 'Entrez un emplacement...',
        accessibleLabel: 'Accessible seulement',
        favoritesLabel: 'Favoris',
        toggleLinesLabel: 'Basculer les lignes de métro:',
        walkingTitle: 'Stations à pied',
        bikingTitle: 'Stations à vélo',
        favoritesModalTitle: 'Mes emplacements favoris',
        noFavoritesText: 'Aucun emplacement favori pour le moment. Recherchez un emplacement et cliquez sur l\'étoile pour l\'enregistrer!',
        directionsButton: 'Itinéraire',
        removeButton: 'Supprimer',
        transferStation: 'Station de correspondance',
        accessible: 'Accessible',
        lines: 'Lignes',
        toggleGreen: 'Basculer ligne verte',
        toggleOrange: 'Basculer ligne orange',
        toggleBlue: 'Basculer ligne bleue',
        toggleYellow: 'Basculer ligne jaune',
    }
};

// ============================================================================
// STATION DATA
// ============================================================================

let stationCoordinatesData = [
    {
        "name": "Bonaventure",
        "location": { "lat": 45.498457, "long": -73.566674 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Lucien-L'Allier",
        "location": { "lat": 45.494841, "long": -73.570804 },
        "line": "orange",
    },
    {
        "name": "Villa Maria",
        "location": { "lat": 45.480294, "long": -73.619814 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Vendôme",
        "location": { "lat": 45.472892, "long": -73.603334 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Lionel-Groulx",
        "location": { "lat": 45.482832, "long": -73.579677 },
        "line": ["green", "orange"],
        "accessible": true
    },
    {
        "name": "Place-Saint-Henri",
        "location": { "lat": 45.477015, "long": -73.586404 },
        "line": "orange",
    },
    {
        "name": "Côte-Vertu",
        "location": { "lat": 45.513804, "long": -73.683628 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Du Collège",
        "location": { "lat": 45.509414, "long": -73.674616 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "De la Savane",
        "location": { "lat": 45.49812, "long": -73.659853 },
        "line": "orange",
    },
    {
        "name": "Namur",
        "location": { "lat": 45.495066, "long": -73.653115 },
        "line": "orange",
    },
    {
        "name": "Plamondon",
        "location": { "lat": 45.495517, "long": -73.640756 },
        "line": "orange",
    },
    {
        "name": "Côte-Sainte-Catherine",
        "location": { "lat": 45.492449, "long": -73.632773 },
        "line": "orange",
    },
    {
        "name": "Snowdon",
        "location": { "lat": 45.48586, "long": -73.627667 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Georges-Vanier",
        "location": { "lat": 45.48884, "long": -73.576511 },
        "line": "orange",
    },
    {
        "name": "Angrignon",
        "location": { "lat": 45.446643, "long": -73.604622 },
        "line": "green",
        "accessible": true
    },
    {
        "name": "Monk",
        "location": { "lat": 45.451144, "long": -73.593227 },
        "line": "green"
    },
    {
        "name": "Jolicoeur",
        "location": { "lat": 45.456654, "long": -73.581768 },
        "line": "green",
        "accessible": true
    },
    {
        "name": "Verdun",
        "location": { "lat": 45.459107, "long": -73.571726 },
        "line": "green"
    },
    {
        "name": "De l'Église",
        "location": { "lat": 45.462598, "long": -73.567027 },
        "line": "green"
    },
    {
        "name": "Lasalle",
        "location": { "lat": 45.47086, "long": -73.56662 },
        "line": "green"
    },
    {
        "name": "Charlevoix",
        "location": { "lat": 45.478029, "long": -73.569388 },
        "line": "green"
    },
    {
        "name": "Atwater",
        "location": { "lat": 45.48969, "long": -73.586275 },
        "line": "green"
    },
    {
        "name": "Guy-Concordia",
        "location": { "lat": 45.495218, "long": -73.579741 },
        "line": "green"
    },
    {
        "name": "Peel",
        "location": { "lat": 45.500729, "long": -73.574978 },
        "line": "green"
    },
    {
        "name": "McGill",
        "location": { "lat": 45.50421, "long": -73.571426 },
        "line": "green",
        "accessible": true
    },
    {
        "name": "Place-des-Arts",
        "location": { "lat": 45.507902, "long": -73.568433 },
        "line": "green",
        "accessible": true
    },
    {
        "name": "Saint-Laurent",
        "location": { "lat": 45.510806, "long": -73.564625 },
        "line": "green"
    },
    {
        "name": "Berri-UQAM",
        "location": { "lat": 45.515338, "long": -73.56103 },
        "line": ["green", "orange", "yellow"],
        "accessible": true
    },
    {
        "name": "Beaudry",
        "location": { "lat": 45.519089, "long": -73.555826 },
        "line": "green"
    },
    {
        "name": "Papineau",
        "location": { "lat": 45.523586, "long": -73.551771 },
        "line": "green"
    },
    {
        "name": "Frontenac",
        "location": { "lat": 45.533289, "long": -73.551985 },
        "line": "green"
    },
    {
        "name": "Préfontaine",
        "location": { "lat": 45.541676, "long": -73.554196 },
        "line": "green",
        "accessible": true
    },
    {
        "name": "Joliette",
        "location": { "lat": 45.546987, "long": -73.551299 },
        "line": "green"
    },
    {
        "name": "Pie-IX",
        "location": { "lat": 45.553854, "long": -73.551771 },
        "line": "green",
        "accessible": true
    },
    {
        "name": "Viau",
        "location": { "lat": 45.561321, "long": -73.547019 },
        "line": "green",
        "accessible": true
    },
    {
        "name": "Assomption",
        "location": { "lat": 45.569397, "long": -73.546953 },
        "line": "green"
    },
    {
        "name": "Cadillac",
        "location": { "lat": 45.576869, "long": -73.546599 },
        "line": "green"
    },
    {
        "name": "Langelier",
        "location": { "lat": 45.582748, "long": -73.543103 },
        "line": "green"
    },
    {
        "name": "Radisson",
        "location": { "lat": 45.588898, "long": -73.539466 },
        "line": "green"
    },
    {
        "name": "Honoré-Beaugrand",
        "location": { "lat": 45.596713, "long": -73.535259 },
        "line": "green",
        "accessible": true
    },
    {
        "name": "Côte-des-Neiges",
        "location": { "lat": 45.496436, "long": -73.622904 },
        "line": "blue"
    },
    {
        "name": "Université-de-Montréal",
        "location": { "lat": 45.502285, "long": -73.618161 },
        "line": "blue"
    },
    {
        "name": "Edouard-Montpetit",
        "location": { "lat": 45.509956, "long": -73.612132 },
        "line": "blue"
    },
    {
        "name": "Outremont",
        "location": { "lat": 45.520105, "long": -73.614834 },
        "line": "blue"
    },
    {
        "name": "Acadie",
        "location": { "lat": 45.523383, "long": -73.623569 },
        "line": "blue"
    },
    {
        "name": "Parc",
        "location": { "lat": 45.530343, "long": -73.62417 },
        "line": "blue"
    },
    {
        "name": "Square-Victoria-OACI",
        "location": { "lat": 45.50097, "long": -73.560654 },
        "line": "orange",
    },
    {
        "name": "Place-d'Armes",
        "location": { "lat": 45.505986, "long": -73.559797 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Champ-de-Mars",
        "location": { "lat": 45.510196, "long": -73.556631 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Sherbrooke",
        "location": { "lat": 45.518895, "long": -73.56898 },
        "line": "orange",
    },
    {
        "name": "Mont-Royal",
        "location": { "lat": 45.524765, "long": -73.581554 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Laurier",
        "location": { "lat": 45.528027, "long": -73.588066 },
        "line": "orange",
    },
    {
        "name": "Rosemont",
        "location": { "lat": 45.531801, "long": -73.597787 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Beaubien",
        "location": { "lat": 45.535001, "long": -73.604826 },
        "line": "orange",
    },
    {
        "name": "Jarry",
        "location": { "lat": 45.54338, "long": -73.62934 },
        "line": "orange",
    },
    {
        "name": "Crémazie",
        "location": { "lat": 45.545974, "long": -73.638256 },
        "line": "orange",
    },
    {
        "name": "Sauvé",
        "location": { "lat": 45.550826, "long": -73.655906 },
        "line": "orange",
    },
    {
        "name": "Henri-Bourassa",
        "location": { "lat": 45.554237, "long": -73.667783 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Cartier",
        "location": { "lat": 45.561282031994494, "long": -73.68124581499659 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "De La Concorde",
        "location": { "lat": 45.56050350465828, "long": -73.71004647620353 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Montmorency",
        "location": { "lat": 45.557165587953314, "long": -73.71959450062765 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "De Castelnau",
        "location": { "lat": 45.535108, "long": -73.619985 },
        "line": "blue"
    },
    {
        "name": "Jean-Talon",
        "location": { "lat": 45.538805, "long": -73.613676 },
        "line": "orange",
        "accessible": true
    },
    {
        "name": "Fabre",
        "location": { "lat": 45.546424, "long": -73.608012 },
        "line": "blue"
    },
    {
        "name": "D'Iberville",
        "location": { "lat": 45.553938, "long": -73.602046 },
        "line": "blue"
    },
    {
        "name": "Saint-Michel",
        "location": { "lat": 45.558925, "long": -73.599601 },
        "line": "blue"
    },
    {
        "name": "Jean-Drapeau",
        "location": { "lat": 45.512332, "long": -73.535829 },
        "line": "yellow"
    },
    {
        "name": "Longueuil–Université-de-Sherbrooke",
        "location": { "lat": 45.525441, "long": -73.521967 },
        "line": "yellow"
    }
];

// ============================================================================
// LINE DATA
// ============================================================================

let lineStrings = [
    {
        "name": "Verte / Green",
        "styleUrl": "#line-33CC00-7000",
        "color": "#009B3A",
        "coordinates": [
            { "lat": 45.596713, "lng": -73.535313 },
            { "lat": 45.588845, "lng": -73.539518 },
            { "lat": 45.582658, "lng": -73.543124 },
            { "lat": 45.576802, "lng": -73.546685 },
            { "lat": 45.569321, "lng": -73.546987 },
            { "lat": 45.561239, "lng": -73.547072 },
            { "lat": 45.553817, "lng": -73.551793 },
            { "lat": 45.546875, "lng": -73.551277 },
            { "lat": 45.541615, "lng": -73.554282 },
            { "lat": 45.533199, "lng": -73.552051 },
            { "lat": 45.523457, "lng": -73.551749 },
            { "lat": 45.519038, "lng": -73.555913 },
            { "lat": 45.515278, "lng": -73.561105 },
            { "lat": 45.510767, "lng": -73.564667 },
            { "lat": 45.507911, "lng": -73.568573 },
            { "lat": 45.50421, "lng": -73.571577 },
            { "lat": 45.500722, "lng": -73.575052 },
            { "lat": 45.495218, "lng": -73.579817 },
            { "lat": 45.489651, "lng": -73.58634 },
            { "lat": 45.482731, "lng": -73.579688 },
            { "lat": 45.477947, "lng": -73.56943 },
            { "lat": 45.470815, "lng": -73.566642 },
            { "lat": 45.462538, "lng": -73.56707 },
            { "lat": 45.458987, "lng": -73.571792 },
            { "lat": 45.456639, "lng": -73.581877 },
            { "lat": 45.446402, "lng": -73.604406 }
        ]
    },
    {
        "name": "Orange / Orange",
        "styleUrl": "#line-FF6600-5000",
        "color": "#FF6D00",
        "coordinates": [
            { "lat": 45.512962, "lng": -73.683586 },
            { "lat": 45.508994, "lng": -73.67483 },
            { "lat": 45.497925, "lng": -73.659381 },
            { "lat": 45.494675, "lng": -73.652859 },
            { "lat": 45.495398, "lng": -73.640842 },
            { "lat": 45.492029, "lng": -73.632259 },
            { "lat": 45.485289, "lng": -73.62728 },
            { "lat": 45.479872, "lng": -73.6199 },
            { "lat": 45.472411, "lng": -73.603249 },
            { "lat": 45.476743, "lng": -73.586596 },
            { "lat": 45.483122, "lng": -73.580073 },
            { "lat": 45.489502, "lng": -73.57664 },
            { "lat": 45.494796, "lng": -73.57149 },
            { "lat": 45.498406, "lng": -73.566685 },
            { "lat": 45.501533, "lng": -73.560847 },
            { "lat": 45.506227, "lng": -73.559818 },
            { "lat": 45.510437, "lng": -73.556556 },
            { "lat": 45.515489, "lng": -73.561363 },
            { "lat": 45.518495, "lng": -73.56943 },
            { "lat": 45.524509, "lng": -73.581619 },
            { "lat": 45.527757, "lng": -73.588142 },
            { "lat": 45.531725, "lng": -73.598099 },
            { "lat": 45.53858, "lng": -73.613547 },
            { "lat": 45.543148, "lng": -73.629856 },
            { "lat": 45.545912, "lng": -73.638439 },
            { "lat": 45.550601, "lng": -73.656291 },
            { "lat": 45.554448, "lng": -73.667964 },
            { "lat": 45.561282031994494, "lng": -73.68124581499659 },
            { "lat": 45.56050350465828, "lng": -73.71004647620353 },
            { "lat": 45.557165587953314, "lng": -73.71959450062765 }
        ]
    },
    {
        "name": "Bleue / Blue",
        "styleUrl": "#line-33CCFF-5000",
        "color": "#009DDC",
        "coordinates": [
            { "lat": 45.559136, "lng": -73.599815 },
            { "lat": 45.553848, "lng": -73.602219 },
            { "lat": 45.546154, "lng": -73.608226 },
            { "lat": 45.53882, "lng": -73.613892 },
            { "lat": 45.535212, "lng": -73.620243 },
            { "lat": 45.530282, "lng": -73.624534 },
            { "lat": 45.523428, "lng": -73.623847 },
            { "lat": 45.519699, "lng": -73.61475 },
            { "lat": 45.510075, "lng": -73.612346 },
            { "lat": 45.502496, "lng": -73.618697 },
            { "lat": 45.496481, "lng": -73.62316 },
            { "lat": 45.485891, "lng": -73.627796 }
        ]
    },
    {
        "name": "Jaune / Yellow",
        "styleUrl": "#line-FFFF33-5000",
        "color": "#FEE100",
        "coordinates": [
            { "lat": 45.515158, "lng": -73.561105 },
            { "lat": 45.512332, "lng": -73.535829 },
            { "lat": 45.525441, "lng": -73.521967 }
        ]
    }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function t(key) {
    return translations[currentLanguage][key] || key;
}

function updateUILanguage() {
    document.getElementById('header-title').textContent = t('headerTitle');
    document.getElementById('header-subtitle').textContent = t('headerSubtitle');
    document.getElementById('lang-text').textContent = t('langButton');
    document.getElementById('autocomplete').placeholder = t('searchPlaceholder');
    document.getElementById('accessibility-label').textContent = t('accessibleLabel');
    document.getElementById('favorites-label').textContent = t('favoritesLabel');
    document.getElementById('toggle-lines-label').textContent = t('toggleLinesLabel');
    document.getElementById('walking-title').textContent = t('walkingTitle');
    document.getElementById('biking-title').textContent = t('bikingTitle');
    document.getElementById('favorites-modal-title').textContent = t('favoritesModalTitle');
    document.getElementById('no-favorites-text').textContent = t('noFavoritesText');
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function getLineColor(line) {
    const colors = {
        green: '#009B3A',
        orange: '#FF6D00',
        blue: '#009DDC',
        yellow: '#FEE100'
    };
    return colors[line] || '#666';
}

function getLineBadgeClass(line) {
    return `line-${line}`;
}

function isTransferStation(station) {
    return Array.isArray(station.line);
}

function renderLineBadges(lines) {
    const lineArray = Array.isArray(lines) ? lines : [lines];
    return lineArray.map(line =>
        `<span class="line-badge ${getLineBadgeClass(line)}">${line.toUpperCase()}</span>`
    ).join('');
}

// ============================================================================
// FAVORITES MANAGEMENT
// ============================================================================

function getFavorites() {
    const favorites = localStorage.getItem('mtl-subway-favorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorite(address, lat, lng) {
    const favorites = getFavorites();
    const newFavorite = { address, lat, lng, timestamp: Date.now() };

    // Check if already exists
    const exists = favorites.some(fav => fav.address === address);
    if (!exists) {
        favorites.push(newFavorite);
        localStorage.setItem('mtl-subway-favorites', JSON.stringify(favorites));
        updateFavoritesCount();
        showNotification('Added to favorites!');
    }
}

function removeFavorite(address) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav.address !== address);
    localStorage.setItem('mtl-subway-favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    renderFavoritesList();
    showNotification('Removed from favorites');
}

function isFavorite(address) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.address === address);
}

function updateFavoritesCount() {
    const count = getFavorites().length;
    document.getElementById('favorites-count').textContent = count;
}

function renderFavoritesList() {
    const favorites = getFavorites();
    const listContainer = document.getElementById('favorites-list');
    const noFavoritesDiv = document.getElementById('no-favorites');

    if (favorites.length === 0) {
        listContainer.innerHTML = '';
        noFavoritesDiv.style.display = 'block';
    } else {
        noFavoritesDiv.style.display = 'none';
        listContainer.innerHTML = favorites.map(fav => `
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                <div class="flex-1 cursor-pointer" onclick="loadFavoriteLocation('${escapeHtml(fav.address)}', ${fav.lat}, ${fav.lng})">
                    <p class="font-semibold text-slate-800">${escapeHtml(fav.address)}</p>
                    <p class="text-sm text-slate-500">${fav.lat.toFixed(6)}, ${fav.lng.toFixed(6)}</p>
                </div>
                <button onclick="removeFavorite('${escapeHtml(fav.address)}')"
                    class="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all text-sm font-medium">
                    <i class="fas fa-trash"></i> ${t('removeButton')}
                </button>
            </div>
        `).join('');
    }
}

function loadFavoriteLocation(address, lat, lng) {
    document.getElementById('autocomplete').value = address;
    const location = new google.maps.LatLng(lat, lng);
    map.setCenter(location);
    map.setZoom(17);
    currentLocation = location;
    lastSearchedAddress = address;

    calculateDistances(location, "WALKING");
    calculateDistances(location, "BICYCLING");

    closeFavoritesModal();
    scrollToFirstResult();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    // Simple notification (you could enhance this with a toast library)
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============================================================================
// MAP INITIALIZATION
// ============================================================================

let stationCoordinates = [];
let lineStringPolylines = [];

function loadStationData() {
    stationCoordinates = stationCoordinatesData.map(station => ({
        name: station.name,
        lat: station.location.lat,
        lng: station.location.long,
        line: station.line,
        accessible: station.accessible || false
    }));
}

function createPolylines() {
    lineStrings.forEach((lineString) => {
        let polyline = new google.maps.Polyline({
            path: lineString.coordinates,
            geodesic: true,
            strokeColor: lineString.color,
            strokeOpacity: 0.8,
            strokeWeight: 5,
            map: null // Initially hidden
        });
        lineStringPolylines.push({ name: lineString.name, polyline: polyline, color: lineString.color });
    });
}

function initMap() {
    const montreal = new google.maps.LatLng(45.5017, -73.5673);
    map = new google.maps.Map(document.getElementById('map'), {
        center: montreal,
        zoom: 12,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: '#009B3A',
            strokeWeight: 5
        }
    });
    directionsRenderer.setMap(map);

    loadStationData();
    createPolylines();
    createToggleButtons();
    setupEventListeners();
}

function createToggleButtons() {
    const buttonsContainer = document.getElementById('buttonsContainer');

    lineStringPolylines.forEach((lineString) => {
        let button = document.createElement("button");
        button.className = 'toggle-button px-4 py-2 rounded-lg font-semibold text-white shadow-md hover:shadow-lg';
        button.style.backgroundColor = lineString.color;
        button.style.color = lineString.color === '#FEE100' ? '#000' : '#fff';
        button.innerHTML = `<i class="fas fa-subway mr-2"></i>${lineString.name.split('/')[0].trim()}`;
        button.addEventListener('click', function () {
            toggleOverlay(lineString.polyline, button);
        });
        buttonsContainer.appendChild(button);
    });
}

function toggleOverlay(polyline, button) {
    if (polyline.getMap()) {
        polyline.setMap(null);
        button.classList.remove('active');
    } else {
        polyline.setMap(map);
        button.classList.add('active');
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Language toggle
    document.getElementById('lang-toggle').addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
        updateUILanguage();

        // Re-render results if they exist
        if (currentLocation) {
            calculateDistances(currentLocation, "WALKING");
            calculateDistances(currentLocation, "BICYCLING");
        }
    });

    // Favorites button
    document.getElementById('favorites-btn').addEventListener('click', () => {
        renderFavoritesList();
        document.getElementById('favorites-modal').classList.remove('hidden');
    });

    // Close favorites modal
    document.getElementById('close-favorites').addEventListener('click', closeFavoritesModal);
    document.getElementById('favorites-modal').addEventListener('click', (e) => {
        if (e.target.id === 'favorites-modal') {
            closeFavoritesModal();
        }
    });

    // Accessibility filter
    document.getElementById('accessibility-filter').addEventListener('change', () => {
        if (currentLocation) {
            calculateDistances(currentLocation, "WALKING");
            calculateDistances(currentLocation, "BICYCLING");
        }
    });
}

function closeFavoritesModal() {
    document.getElementById('favorites-modal').classList.add('hidden');
}

// ============================================================================
// SEARCH AND RESULTS
// ============================================================================

function findStations() {
    const locationInput = document.getElementById('autocomplete').value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': locationInput }, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            const origin = results[0].geometry.location;
            currentLocation = origin;
            lastSearchedAddress = locationInput;

            calculateDistances(origin, "WALKING");
            calculateDistances(origin, "BICYCLING");
            scrollToFirstResult();
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function scrollToFirstResult() {
    const resultsElement = document.getElementById('results');
    if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function calculateDistances(origin, travelMode) {
    const accessibleOnly = document.getElementById('accessibility-filter').checked;

    // Filter stations based on accessibility if needed
    let filteredStations = accessibleOnly
        ? stationCoordinates.filter(s => s.accessible)
        : stationCoordinates;

    // Calculate haversine distances
    let distances = filteredStations.map(station => ({
        ...station,
        distance: haversineDistance(origin.lat(), origin.lng(), station.lat, station.lng)
    }));

    distances.sort((a, b) => a.distance - b.distance);
    let closestStations = distances.slice(0, 5);

    // Get actual walking/biking distances from Google
    const distanceMatrixService = new google.maps.DistanceMatrixService();
    const destinations = closestStations.map(station => new google.maps.LatLng(station.lat, station.lng));

    distanceMatrixService.getDistanceMatrix({
        origins: [origin],
        destinations: destinations,
        travelMode: travelMode,
    }, function (response, status) {
        if (status === 'OK') {
            const results = processDistanceResults(response, closestStations, travelMode);
            displayCombinedResults(results, travelMode);
        } else {
            alert('Error was: ' + status);
        }
    });
}

function processDistanceResults(response, chunk, travelMode) {
    const distances = response.rows[0].elements;
    return chunk.map((station, i) => {
        const stationData = stationCoordinatesData.find(s => s.name === station.name);
        return {
            station: station.name,
            distance: distances[i].distance.text,
            duration: distances[i].duration.text,
            travelMode: travelMode,
            accessible: station.accessible,
            line: station.line,
            isTransfer: isTransferStation(station)
        };
    });
}

function displayCombinedResults(allResults, travelMode) {
    let resultsListContainerId = travelMode.toLowerCase() === 'walking'
        ? 'walking-results-list'
        : 'bicycling-results-list';
    let resultsListContainer = document.getElementById(resultsListContainerId);

    if (!resultsListContainer) {
        console.error('Results list container not found for:', resultsListContainerId);
        return;
    }

    resultsListContainer.innerHTML = '';

    // Sort and display top 3 results
    allResults.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    for (let i = 0; i < Math.min(3, allResults.length); i++) {
        const result = allResults[i];
        const stationCard = createStationCard(result, travelMode);
        resultsListContainer.appendChild(stationCard);
    }
}

function createStationCard(result, travelMode) {
    const card = document.createElement('div');
    card.className = 'station-card bg-slate-50 rounded-xl p-4 cursor-pointer hover:shadow-md';
    card.dataset.station = result.station;
    card.dataset.travelMode = travelMode;

    const accessibleBadge = result.accessible
        ? `<span class="text-blue-600 text-lg" title="${t('accessible')}"><i class="fas fa-wheelchair"></i></span>`
        : '';

    const transferBadge = result.isTransfer
        ? `<span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold ml-2">${t('transferStation')}</span>`
        : '';

    card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
                <h4 class="font-bold text-lg text-slate-800 mb-1 flex items-center gap-2">
                    ${result.station}
                    ${accessibleBadge}
                </h4>
                <div class="flex flex-wrap items-center gap-1 mb-2">
                    ${renderLineBadges(result.line)}
                    ${transferBadge}
                </div>
            </div>
        </div>
        <div class="flex items-center justify-between text-slate-600 mb-3">
            <span class="flex items-center gap-1">
                <i class="fas fa-route text-blue-600"></i>
                <strong>${result.distance}</strong>
            </span>
            <span class="flex items-center gap-1">
                <i class="fas fa-clock text-green-600"></i>
                <strong>${result.duration}</strong>
            </span>
        </div>
        <button class="directions-btn w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg">
            <i class="fas fa-directions mr-2"></i>${t('directionsButton')}
        </button>
    `;

    // Add click event for directions
    const directionsBtn = card.querySelector('.directions-btn');
    directionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        displayDirections(result.station, travelMode, card);
    });

    return card;
}

function displayDirections(stationName, travelMode, cardElement) {
    const originAddress = document.getElementById('autocomplete').value;

    // Remove selection from all cards
    document.querySelectorAll('.station-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selection to clicked card
    if (cardElement) {
        cardElement.classList.add('selected');
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
                    map.setZoom(14);
                } else {
                    alert('Directions request failed due to ' + status);
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function getStationLatLng(stationName) {
    const station = stationCoordinates.find(s => s.name === stationName);
    if (station) {
        return new google.maps.LatLng(station.lat, station.lng);
    } else {
        console.error('Station not found:', stationName);
        return null;
    }
}

// ============================================================================
// AUTOCOMPLETE INITIALIZATION
// ============================================================================

function initAutocomplete() {
    initMap();

    const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        { types: ['geocode'] }
    );

    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();

        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        // Add to favorites option after search
        lastSearchedAddress = place.formatted_address || document.getElementById('autocomplete').value;

        // Show favorite star
        if (!isFavorite(lastSearchedAddress)) {
            setTimeout(() => {
                const shouldSave = confirm('Save this location to favorites?');
                if (shouldSave) {
                    saveFavorite(
                        lastSearchedAddress,
                        place.geometry.location.lat(),
                        place.geometry.location.lng()
                    );
                }
            }, 500);
        }

        findStations();
    });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

window.onload = function() {
    initAutocomplete();
    updateUILanguage();
    updateFavoritesCount();
};
