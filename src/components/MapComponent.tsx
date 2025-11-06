import { useEffect, useRef, useState } from 'react';
import { metroStations } from '../data/stationsData';
import { mapStyles } from '../styles/mapStyles';

// Metro line colors
const LINE_COLORS = {
  green: '#009B4F',
  orange: '#F68020',
  blue: '#009DDC',
  yellow: '#FFD200',
};

interface MapComponentProps {
  userLocation?: { lat: number; lng: number } | null;
  selectedLocation?: google.maps.LatLng | null;
}

export function MapComponent({ userLocation, selectedLocation }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) {
        return;
      }

      try {
        // Create map centered on Montreal
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 45.5017, lng: -73.5673 }, // Montreal coordinates
          zoom: 12,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
          },
          streetViewControl: true,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
          },
          styles: mapStyles, // Apply custom styling
        });

        setMap(mapInstance);
        console.log('✅ Google Maps initialized successfully');

        // Add markers for all metro stations
        metroStations.forEach((station) => {
          const lines = Array.isArray(station.line) ? station.line : [station.line];
          const primaryLine = lines[0];
          const color = LINE_COLORS[primaryLine as keyof typeof LINE_COLORS] || '#666';

          // Create custom marker
          const marker = new google.maps.Marker({
            position: station.location,
            map: mapInstance,
            title: station.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: color,
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          // Info window for station details
          const infoContent = `
            <div style="padding: 8px; font-family: system-ui;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${station.name}</h3>
              <p style="margin: 4px 0; color: #666; font-size: 14px;">
                <strong>Line${lines.length > 1 ? 's' : ''}:</strong> ${lines.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}
              </p>
              ${station.accessible ? '<p style="margin: 4px 0; color: #059669; font-size: 14px;">♿ Accessible</p>' : ''}
            </div>
          `;

          const infoWindow = new google.maps.InfoWindow({
            content: infoContent,
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
          });
        });

        // Group stations by their PRIMARY line only (to avoid duplicates)
        // and maintain the order from the stationsData array
        const lineStations: Record<string, typeof metroStations> = {
          green: [],
          orange: [],
          blue: [],
          yellow: [],
        };

        metroStations.forEach((station) => {
          // Only use the primary line (first line in the array)
          const primaryLine = Array.isArray(station.line) ? station.line[0] : station.line;
          if (lineStations[primaryLine]) {
            lineStations[primaryLine].push(station);
          }
        });

        // Draw polylines for each metro line
        // The stations are already in order from the data file
        Object.entries(lineStations).forEach(([line, stations]) => {
          if (stations.length > 1) {
            const path = stations.map((s) => s.location);
            new google.maps.Polyline({
              path: path,
              geodesic: false,
              strokeColor: LINE_COLORS[line as keyof typeof LINE_COLORS],
              strokeOpacity: 0.8,
              strokeWeight: 4,
              map: mapInstance,
            });
          }
        });

        console.log(`✅ Added ${metroStations.length} metro station markers`);
      } catch (error) {
        console.error('Failed to initialize Google Maps:', error);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      initMap();
    } else {
      // Wait for Google Maps to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          initMap();
          clearInterval(checkInterval);
        }
      }, 100);

      // Clean up interval after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);

      return () => clearInterval(checkInterval);
    }
  }, []);

  // Update user location marker when location changes
  useEffect(() => {
    if (!map || !userLocation) return;

    // Remove old marker if exists
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    // Add new marker
    const marker = new google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#EF4444',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      animation: google.maps.Animation.DROP,
    });

    userMarkerRef.current = marker;

    // Center map on user location
    map.panTo(userLocation);
    map.setZoom(14);
  }, [map, userLocation]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div
        id="map"
        ref={mapRef}
        className="w-full h-96 sm:h-[500px]"
      />

      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 glass-card rounded-xl shadow-xl p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Metro Lines</h3>
        <div className="space-y-2">
          {Object.entries(LINE_COLORS).map(([line, color]) => (
            <div key={line} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-slate-700 capitalize">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
