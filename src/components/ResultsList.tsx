import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '../lib/utils';

interface ResultsListProps {
  language: 'en' | 'fr';
  userLocation?: { lat: number; lng: number } | null;
}

import { metroStations } from '../data/stationsData';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// This will be populated from state once we migrate the functionality
export function ResultsList({ language, userLocation }: ResultsListProps) {
  // Calculate nearby stations if user location is available
  const results = userLocation
    ? metroStations
        .map((station) => ({
          ...station,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            station.location.lat,
            station.location.lng
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10) // Show top 10 nearest stations
        .map((station) => ({
          station: station.name,
          distance: `${station.distance.toFixed(2)} km`,
          duration: `~${Math.ceil(station.distance * 12)} min`, // Estimate ~12 min per km
          line: Array.isArray(station.line) ? station.line.join(', ') : station.line,
          accessible: station.accessible,
        }))
    : [];
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">
            {language === 'en' ? 'Finding best routes...' : 'Recherche des meilleurs itinéraires...'}
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 glass-card rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="text-6xl mb-4 animate-bounce">🗺️</div>
        <p className="text-slate-600 font-medium text-lg">
          {language === 'en'
            ? 'Enter a location to find nearby metro stations'
            : 'Entrez un emplacement pour trouver les stations de métro à proximité'}
        </p>
      </div>
    );
  }

  return (
    <div id="results" className="space-y-3">
      <Accordion.Root type="multiple" className="space-y-3">
        {results.map((result, index) => (
          <Accordion.Item
            key={index}
            value={`item-${index}`}
            className={cn(
              "glass-card rounded-2xl",
              "overflow-hidden",
              "hover:shadow-2xl transition-all duration-300",
              "transform hover:-translate-y-1"
            )}
          >
            <Accordion.Header>
              <Accordion.Trigger
                className={cn(
                  "w-full px-6 py-4",
                  "flex items-center justify-between",
                  "text-left",
                  "hover:bg-slate-50 transition-colors",
                  "group"
                )}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {result.station}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {result.distance} • {result.duration}
                    </p>
                  </div>
                </div>
                <ChevronDownIcon
                  className="w-5 h-5 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content
              className={cn(
                "overflow-hidden",
                "data-[state=open]:animate-accordion-down",
                "data-[state=closed]:animate-accordion-up"
              )}
            >
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🚇</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {language === 'en' ? 'Metro Line' : 'Ligne de métro'}
                      </h4>
                      <p className="text-sm text-slate-600 capitalize">
                        {result.line}
                      </p>
                    </div>
                  </div>

                  {result.accessible && (
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">♿</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {language === 'en' ? 'Accessibility' : 'Accessibilité'}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {language === 'en'
                            ? 'This station is wheelchair accessible'
                            : 'Cette station est accessible en fauteuil roulant'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🚶</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {language === 'en' ? 'Walking Directions' : 'Itinéraire à pied'}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {language === 'en'
                          ? `Approximately ${result.duration} walk from your location`
                          : `Environ ${result.duration} de marche depuis votre emplacement`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📍</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {language === 'en' ? 'Distance' : 'Distance'}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {result.distance} {language === 'en' ? 'from your location' : 'de votre emplacement'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
