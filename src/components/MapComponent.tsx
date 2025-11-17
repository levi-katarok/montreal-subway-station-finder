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
  onLocationSelected?: (location: { lat: number; lng: number }) => void;
  accessibleOnly?: boolean;
  activeLines?: string[];
}

export function MapComponent({ userLocation, onLocationSelected, accessibleOnly, activeLines }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showTransit, setShowTransit] = useState(false);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const transitLayerRef = useRef<google.maps.TransitLayer | null>(null);
  const distanceCircleRef = useRef<google.maps.Circle | null>(null);
  const stationMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map());

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

        // Click on map to select location
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng && onLocationSelected) {
            onLocationSelected({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          }
        });

        // Initialize directions renderer
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: mapInstance,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#F472B6',
            strokeWeight: 4,
            strokeOpacity: 0.8,
          },
        });
        directionsRendererRef.current = directionsRenderer;

        // Initialize transit layer
        const transitLayer = new google.maps.TransitLayer();
        transitLayerRef.current = transitLayer;

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

          // Store marker reference
          stationMarkersRef.current.set(station.name, marker);
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

  // Draw walking route to nearest station
  useEffect(() => {
    if (!map || !userLocation || !window.google?.maps) return;

    // Calculate distances and find nearest station
    const stationsWithDistance = metroStations.map((station) => {
      const R = 6371; // Radius of Earth in km
      const dLat = (station.location.lat - userLocation.lat) * Math.PI / 180;
      const dLon = (station.location.lng - userLocation.lng) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(station.location.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return { ...station, distance };
    });

    const nearestStation = stationsWithDistance.reduce((prev, current) =>
      prev.distance < current.distance ? prev : current
    );

    // Highlight nearest station
    stationMarkersRef.current.forEach((marker, name) => {
      if (name === nearestStation.name) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 2000);
        // Make it slightly larger
        const lines = Array.isArray(nearestStation.line) ? nearestStation.line : [nearestStation.line];
        const primaryLine = lines[0];
        const color = LINE_COLORS[primaryLine as keyof typeof LINE_COLORS] || '#666';
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        });
      } else {
        // Reset other markers
        const station = metroStations.find(s => s.name === name);
        if (station) {
          const lines = Array.isArray(station.line) ? station.line : [station.line];
          const primaryLine = lines[0];
          const color = LINE_COLORS[primaryLine as keyof typeof LINE_COLORS] || '#666';
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          });
        }
      }
    });

    // Draw walking route
    if (directionsRendererRef.current) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: nearestStation.location,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === 'OK' && result && directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
          }
        }
      );
    }

    // Draw distance circle (1km radius)
    if (distanceCircleRef.current) {
      distanceCircleRef.current.setMap(null);
    }
    const circle = new google.maps.Circle({
      strokeColor: '#F472B6',
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: '#F472B6',
      fillOpacity: 0.1,
      map: map,
      center: userLocation,
      radius: 1000, // 1km in meters
    });
    distanceCircleRef.current = circle;
  }, [map, userLocation]);

  // Toggle transit layer
  useEffect(() => {
    if (!map || !transitLayerRef.current) return;

    if (showTransit) {
      transitLayerRef.current.setMap(map);
    } else {
      transitLayerRef.current.setMap(null);
    }
  }, [map, showTransit]);

  // Filter markers based on accessibility and active lines
  useEffect(() => {
    if (!map) return;

    stationMarkersRef.current.forEach((marker, name) => {
      const station = metroStations.find(s => s.name === name);
      if (!station) return;

      let shouldShow = true;

      // Filter by accessibility
      if (accessibleOnly && !station.accessible) {
        shouldShow = false;
      }

      // Filter by active lines
      if (activeLines && activeLines.length > 0) {
        const stationLines = Array.isArray(station.line) ? station.line : [station.line];
        const hasActiveLine = stationLines.some(line => activeLines.includes(line));
        if (!hasActiveLine) {
          shouldShow = false;
        }
      }

      marker.setVisible(shouldShow);
    });
  }, [map, accessibleOnly, activeLines]);

  // Use current location
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (onLocationSelected) {
            onLocationSelected(location);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div
        id="map"
        ref={mapRef}
        className="w-full h-96 sm:h-[500px]"
      />

      {/* Map Controls - Top Left */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {/* Use My Location Button */}
        <button
          onClick={handleUseMyLocation}
          className="glass-card rounded-lg shadow-lg p-3 hover:bg-white/90 transition-all duration-150 group"
          title="Use my current location"
        >
          <svg
            className="w-5 h-5 text-slate-700 group-hover:text-pink-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Transit Layer Toggle */}
        <button
          onClick={() => setShowTransit(!showTransit)}
          className={`glass-card rounded-lg shadow-lg p-3 transition-all duration-150 group ${
            showTransit ? 'bg-pink-100/80 ring-2 ring-pink-400/50' : 'hover:bg-white/90'
          }`}
          title="Toggle transit layer"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              showTransit ? 'text-pink-600' : 'text-slate-700 group-hover:text-pink-600'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>
      </div>

      {/* Info Banner - Top Center */}
      {userLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-card rounded-lg shadow-xl px-4 py-2">
          <p className="text-xs text-slate-700 font-medium flex items-center gap-2">
            <span className="text-pink-600">👆</span>
            Click map to change location
          </p>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 glass-card rounded-xl shadow-xl p-4 max-w-[200px]">
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

        {/* Legend items */}
        <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-400" />
            <span className="text-xs text-slate-600">Walking route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-slate-600">Your location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
