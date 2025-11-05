// ============================================================================
// TRANSLATION UTILITIES
// ============================================================================

import type { Language } from '../types';

export const translations = {
  en: {
    // Header
    headerTitle: 'Montreal Transit Explorer',
    headerSubtitle: 'Multi-modal journey planner with weather integration',
    langButton: 'FR',

    // Search
    searchPlaceholder: 'Enter your location or address...',
    searching: 'Finding best routes...',

    // Filters
    accessibleLabel: 'Accessible Only',
    preferIndoorLabel: 'Prefer Indoor Routes',
    allowDrivingLabel: 'Include Driving',

    // Buttons
    favoritesLabel: 'Favorites',
    directionsButton: 'Get Directions',
    removeButton: 'Remove',
    closeButton: 'Close',

    // Titles
    walkingTitle: 'Walking Routes',
    bikingTitle: 'Biking Routes',
    multiModalTitle: 'Multi-Modal Options',
    weatherTitle: 'Current Weather',
    toggleLinesLabel: 'Toggle Metro Lines:',

    // Station info
    transferStation: 'Transfer Station',
    accessible: 'Accessible',
    lines: 'Lines',
    facilities: 'Facilities',
    connections: 'Connections',

    // Transit types
    metro: 'Metro',
    rem: 'REM',
    train: 'Train',
    bus: 'Bus',
    parking: 'Parking',

    // Journey segments
    walkTo: 'Walk to',
    bikeTo: 'Bike to',
    driveTo: 'Drive to',
    takeMetro: 'Take metro',
    takeREM: 'Take REM',
    takeTrain: 'Take train',
    takeBus: 'Take bus',

    // Recommendations
    recommended: 'Recommended',
    fastest: 'Fastest',
    cheapest: 'Cheapest',
    mostAccessible: 'Most Accessible',
    weatherOptimized: 'Weather Optimized',

    // Weather
    temperature: 'Temperature',
    feelsLike: 'Feels like',
    conditions: 'Conditions',
    humidity: 'Humidity',
    windSpeed: 'Wind',

    // Favorites
    favoritesModalTitle: 'My Favorite Locations',
    noFavoritesText: 'No favorite locations saved yet',
    addToFavorites: 'Add to favorites',
    savedToFavorites: 'Saved to favorites!',
    removedFromFavorites: 'Removed from favorites',

    // Transfer info
    transferTime: 'Transfer time',
    transferDistance: 'Distance',
    indoorConnection: 'Indoor connection',
    accessibleTransfer: 'Accessible transfer',

    // Errors
    errorLoadingWeather: 'Could not load weather',
    errorFindingStations: 'Error finding stations',
    errorGeocode: 'Could not find this location',
    noStationsFound: 'No stations found nearby',

    // Units
    minutes: 'min',
    meters: 'm',
    kilometers: 'km',
    perHour: '/h',
  },

  fr: {
    // Header
    headerTitle: 'Explorateur de Transport de Montréal',
    headerSubtitle: 'Planificateur de voyage multimodal avec intégration météo',
    langButton: 'EN',

    // Search
    searchPlaceholder: 'Entrez votre emplacement ou adresse...',
    searching: 'Recherche des meilleurs itinéraires...',

    // Filters
    accessibleLabel: 'Accessible seulement',
    preferIndoorLabel: 'Préférer les routes intérieures',
    allowDrivingLabel: 'Inclure la conduite',

    // Buttons
    favoritesLabel: 'Favoris',
    directionsButton: 'Obtenir l\'itinéraire',
    removeButton: 'Supprimer',
    closeButton: 'Fermer',

    // Titles
    walkingTitle: 'Itinéraires à pied',
    bikingTitle: 'Itinéraires à vélo',
    multiModalTitle: 'Options multimodales',
    weatherTitle: 'Météo actuelle',
    toggleLinesLabel: 'Basculer les lignes de métro:',

    // Station info
    transferStation: 'Station de correspondance',
    accessible: 'Accessible',
    lines: 'Lignes',
    facilities: 'Installations',
    connections: 'Connexions',

    // Transit types
    metro: 'Métro',
    rem: 'REM',
    train: 'Train',
    bus: 'Autobus',
    parking: 'Stationnement',

    // Journey segments
    walkTo: 'Marcher vers',
    bikeTo: 'Vélo vers',
    driveTo: 'Conduire vers',
    takeMetro: 'Prendre le métro',
    takeREM: 'Prendre le REM',
    takeTrain: 'Prendre le train',
    takeBus: 'Prendre l\'autobus',

    // Recommendations
    recommended: 'Recommandé',
    fastest: 'Le plus rapide',
    cheapest: 'Le moins cher',
    mostAccessible: 'Le plus accessible',
    weatherOptimized: 'Optimisé pour la météo',

    // Weather
    temperature: 'Température',
    feelsLike: 'Ressenti',
    conditions: 'Conditions',
    humidity: 'Humidité',
    windSpeed: 'Vent',

    // Favorites
    favoritesModalTitle: 'Mes emplacements favoris',
    noFavoritesText: 'Aucun emplacement favori enregistré',
    addToFavorites: 'Ajouter aux favoris',
    savedToFavorites: 'Enregistré dans les favoris!',
    removedFromFavorites: 'Retiré des favoris',

    // Transfer info
    transferTime: 'Temps de transfert',
    transferDistance: 'Distance',
    indoorConnection: 'Connexion intérieure',
    accessibleTransfer: 'Transfert accessible',

    // Errors
    errorLoadingWeather: 'Impossible de charger la météo',
    errorFindingStations: 'Erreur lors de la recherche des stations',
    errorGeocode: 'Impossible de trouver cet emplacement',
    noStationsFound: 'Aucune station trouvée à proximité',

    // Units
    minutes: 'min',
    meters: 'm',
    kilometers: 'km',
    perHour: '/h',
  },
};

export function t(key: keyof typeof translations.en, language: Language = 'en'): string {
  return translations[language][key] || translations.en[key] || key;
}

export function formatDistance(meters: number, language: Language = 'en'): string {
  if (meters < 1000) {
    return `${Math.round(meters)} ${t('meters', language)}`;
  }
  return `${(meters / 1000).toFixed(1)} ${t('kilometers', language)}`;
}

export function formatDuration(minutes: number, language: Language = 'en'): string {
  return `${Math.round(minutes)} ${t('minutes', language)}`;
}

export function formatCost(cost: number, language: Language = 'en'): string {
  return language === 'en' ? `$${cost.toFixed(2)}` : `${cost.toFixed(2)} $`;
}
