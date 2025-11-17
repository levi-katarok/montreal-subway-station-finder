// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

import type { SavedLocation, UserPreferences, Language } from '@shared/types';

const STORAGE_KEYS = {
  FAVORITES: 'mtl-transit-favorites',
  PREFERENCES: 'mtl-transit-preferences',
  WEATHER_CACHE: 'mtl-transit-weather-cache',
} as const;

// ============================================================================
// FAVORITES
// ============================================================================

export function getFavorites(): SavedLocation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

export function saveFavorite(location: Omit<SavedLocation, 'id' | 'timestamp'>): void {
  try {
    const favorites = getFavorites();
    const newFavorite: SavedLocation = {
      ...location,
      id: Date.now().toString(36),
      timestamp: Date.now(),
    };

    // Check for duplicates
    const exists = favorites.some(
      (fav) => fav.address === location.address
    );

    if (!exists) {
      favorites.push(newFavorite);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error saving favorite:', error);
  }
}

export function removeFavorite(id: string): void {
  try {
    const favorites = getFavorites().filter((fav) => fav.id !== id);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

export function isFavorite(address: string): boolean {
  return getFavorites().some((fav) => fav.address === address);
}

// ============================================================================
// USER PREFERENCES
// ============================================================================

export function getPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading preferences:', error);
  }

  // Default preferences
  return {
    language: 'en',
    accessibleOnly: false,
    preferIndoor: false,
    savedLocations: [],
  };
}

export function savePreferences(preferences: Partial<UserPreferences>): void {
  try {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

export function setLanguage(language: Language): void {
  savePreferences({ language });
}

export function getLanguage(): Language {
  return getPreferences().language;
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

export function clearCache(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.WEATHER_CACHE);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}

// ============================================================================
// EXPORT/IMPORT
// ============================================================================

export function exportData(): string {
  return JSON.stringify({
    favorites: getFavorites(),
    preferences: getPreferences(),
    exportDate: new Date().toISOString(),
  }, null, 2);
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);

    if (data.favorites) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(data.favorites));
    }

    if (data.preferences) {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(data.preferences));
    }

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
