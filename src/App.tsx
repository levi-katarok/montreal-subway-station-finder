import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WeatherWidget } from './components/WeatherWidget';
import { SearchSection } from './components/SearchSection';
import { MapComponent } from './components/MapComponent';
import { ResultsList } from './components/ResultsList';
import { FavoritesDialog } from './components/FavoritesDialog';
import { WeatherService } from './services/weatherService';
import type { WeatherData } from './types';

function App() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [preferIndoor, setPreferIndoor] = useState(false);
  const [includeDriving, setIncludeDriving] = useState(false);
  const [activeLines, setActiveLines] = useState<string[]>(['green', 'orange', 'blue', 'yellow']);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Load weather on mount
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const weatherData = await WeatherService.getCurrentWeather();
        if (weatherData) {
          setWeather(weatherData);
        }
      } catch (error) {
        console.error('Failed to load weather:', error);
      }
    };
    loadWeather();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const toggleLine = (line: string) => {
    setActiveLines(prev =>
      prev.includes(line)
        ? prev.filter(l => l !== line)
        : [...prev, line]
    );
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const location = place.geometry.location;
      setSelectedLocation(location);
      setUserLocation({
        lat: location.lat(),
        lng: location.lng(),
      });
      console.log('📍 Location selected:', place.formatted_address);
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {weather && (
          <WeatherWidget weather={weather} language={language} />
        )}

        <SearchSection
          language={language}
          accessibleOnly={accessibleOnly}
          preferIndoor={preferIndoor}
          includeDriving={includeDriving}
          activeLines={activeLines}
          onAccessibleChange={setAccessibleOnly}
          onIndoorChange={setPreferIndoor}
          onDrivingChange={setIncludeDriving}
          onToggleLine={toggleLine}
          onShowFavorites={() => setShowFavorites(true)}
          onPlaceSelected={handlePlaceSelected}
        />

        {/* Side-by-side layout for map and results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MapComponent userLocation={userLocation} selectedLocation={selectedLocation} />
          <ResultsList language={language} userLocation={userLocation} />
        </div>
      </main>

      <FavoritesDialog
        open={showFavorites}
        onOpenChange={setShowFavorites}
        language={language}
      />
    </div>
  );
}

export default App;
