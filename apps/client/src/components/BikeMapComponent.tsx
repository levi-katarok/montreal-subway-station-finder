import { useEffect, useRef, useState } from 'react';
import type { BikeRoute } from '@shared/types';

interface BikeMapComponentProps {
  route?: BikeRoute | null;
  userLocation?: { lat: number; lng: number } | null;
  onLocationSelected?: (location: { lat: number; lng: number }) => void;
  showTraffic?: boolean;
  language: 'en' | 'fr';
  hideControls?: boolean;
}

export function BikeMapComponent({ 
  route, 
  userLocation, 
  onLocationSelected,
  showTraffic = false,
  language,
  hideControls = false
}: BikeMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showTrafficLayer, setShowTrafficLayer] = useState(showTraffic || false);
  const [showBikeLayer, setShowBikeLayer] = useState(true);
  
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const bikeLayerRef = useRef<google.maps.BicyclingLayer | null>(null);
  const elevationMarkersRef = useRef<google.maps.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) {
        console.log('Map ref or Google Maps not ready:', { 
          hasRef: !!mapRef.current, 
          hasGoogle: !!window.google?.maps 
        });
        return;
      }

      // Ensure the map container has dimensions
      if (mapRef.current.offsetHeight === 0 || mapRef.current.offsetWidth === 0) {
        console.log('Map container has no dimensions, retrying...');
        setTimeout(initMap, 100);
        return;
      }

      try {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 45.5017, lng: -73.5673 }, // Montreal
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: !hideControls,
          zoomControl: !hideControls,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#212121' }] },
            { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
            {
              featureType: 'administrative',
              elementType: 'geometry',
              stylers: [{ color: '#757575' }],
            },
            {
              featureType: 'administrative.country',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9e9e9e' }],
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#bdbdbd' }],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575' }],
            },
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#181818' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#616161' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#1b1b1b' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.fill',
              stylers: [{ color: '#2c2c2c' }],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#8a8a8a' }],
            },
            {
              featureType: 'road.arterial',
              elementType: 'geometry',
              stylers: [{ color: '#373737' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#3c3c3c' }],
            },
            {
              featureType: 'road.highway.controlled_access',
              elementType: 'geometry',
              stylers: [{ color: '#4e4e4e' }],
            },
            {
              featureType: 'road.local',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#616161' }],
            },
            {
              featureType: 'transit',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#000000' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#3d3d3d' }],
            },
          ],
        });

        setMap(mapInstance);

        // Click to select location
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng && onLocationSelected) {
            onLocationSelected({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          }
        });

        // Initialize layers (will be toggled via useEffect)
        // Don't set them on the map yet - let the toggle effects handle it

        console.log('✅ Bike Map initialized');
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    if (window.google?.maps) {
      // Small delay to ensure DOM is ready
      setTimeout(initMap, 100);
    } else {
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          initMap();
          clearInterval(checkInterval);
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 10000);
      return () => clearInterval(checkInterval);
    }
  }, [hideControls, onLocationSelected]);

  // Update user location marker
  useEffect(() => {
    if (!map || !userLocation) return;

    // Remove old marker
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
  }, [map, userLocation]);

  // Draw route
  useEffect(() => {
    if (!map || !route) return;

    // Clear previous route
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
    }

    // Clear elevation markers
    elevationMarkersRef.current.forEach(marker => marker.setMap(null));
    elevationMarkersRef.current = [];

    // Decode polyline
    const path = google.maps.geometry.encoding.decodePath(route.polyline);

    // Create gradient polyline based on elevation
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FFFFFF',
      strokeOpacity: 0.9,
      strokeWeight: 6,
      map: map,
    });

    routePolylineRef.current = polyline;

    // Add elevation markers at key points
    if (route.hasElevationData && route.elevationProfile.length > 0) {
      const numMarkers = Math.min(5, route.elevationProfile.length);
      const interval = Math.floor(route.elevationProfile.length / numMarkers);

      for (let i = 0; i < numMarkers; i++) {
        const point = route.elevationProfile[i * interval];
        
        const marker = new google.maps.Marker({
          position: point.location,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: getElevationColor(point.elevation, route.minElevation, route.maxElevation),
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          title: `${Math.round(point.elevation)}m`,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: system-ui;">
              <strong>${language === 'en' ? 'Elevation' : 'Élévation'}:</strong> ${Math.round(point.elevation)}m<br/>
              <strong>${language === 'en' ? 'Distance' : 'Distance'}:</strong> ${(point.distance / 1000).toFixed(2)}km
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        elevationMarkersRef.current.push(marker);
      }
    }

    // Fit bounds to route with padding to prevent cutoff
    if (route.bounds) {
      map.fitBounds(route.bounds, {
        top: 80,
        right: 40,
        bottom: 120,
        left: 40,
      });
    }

  }, [map, route, language]);

  // Toggle traffic layer
  useEffect(() => {
    if (!map) return;

    if (!trafficLayerRef.current) {
      trafficLayerRef.current = new google.maps.TrafficLayer();
    }

    if (showTrafficLayer) {
      trafficLayerRef.current.setMap(map);
    } else {
      trafficLayerRef.current.setMap(null);
    }
  }, [map, showTrafficLayer]);

  // Toggle bike layer
  useEffect(() => {
    if (!map) return;

    if (!bikeLayerRef.current) {
      bikeLayerRef.current = new google.maps.BicyclingLayer();
    }

    if (showBikeLayer) {
      bikeLayerRef.current.setMap(map);
    } else {
      bikeLayerRef.current.setMap(null);
    }
  }, [map, showBikeLayer]);

  const getElevationColor = (elevation: number, min: number, max: number): string => {
    const range = max - min;
    if (range === 0) return '#EC4899';
    
    const normalized = (elevation - min) / range;
    
    // Color gradient from green (low) to red (high)
    if (normalized < 0.5) {
      return `rgb(${Math.round(255 * normalized * 2)}, 200, 50)`;
    } else {
      return `rgb(255, ${Math.round(200 * (1 - normalized))}, 50)`;
    }
  };

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
          if (map) {
            map.panTo(location);
            map.setZoom(15);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(language === 'en' 
            ? 'Unable to get your location. Please check your browser permissions.'
            : 'Impossible d\'obtenir votre position. Vérifiez les permissions du navigateur.');
        }
      );
    } else {
      alert(language === 'en'
        ? 'Geolocation is not supported by your browser.'
        : 'La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  return (
    <div className="w-full h-full relative absolute inset-0 min-h-full">
      <div ref={mapRef} className="w-full h-full absolute inset-0 min-h-full" />

      {/* Map Controls */}
      {!hideControls && (
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {/* Use My Location */}
          {onLocationSelected && (
            <button
              onClick={handleUseMyLocation}
              className="bg-black/80 backdrop-blur-sm rounded-lg p-2.5 hover:bg-black/90 transition-all border border-white/20"
              title={language === 'en' ? 'Use my location' : 'Utiliser ma position'}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}

          {/* Traffic Layer Toggle */}
          <button
            onClick={() => setShowTrafficLayer(!showTrafficLayer)}
            className={`bg-black/80 backdrop-blur-sm rounded-lg p-2.5 transition-all border relative ${
              showTrafficLayer ? 'border-white bg-white/20' : 'border-white/20 hover:bg-black/90'
            }`}
            title={language === 'en' ? 'Toggle traffic' : 'Afficher le trafic'}
          >
            <svg className={`w-5 h-5 ${showTrafficLayer ? 'text-white' : 'text-white/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {showTrafficLayer && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-black" />
            )}
          </button>

          {/* Bike Layer Toggle */}
          <button
            onClick={() => setShowBikeLayer(!showBikeLayer)}
            className={`bg-black/80 backdrop-blur-sm rounded-lg p-2.5 transition-all border ${
              showBikeLayer ? 'border-white bg-white/20' : 'border-white/20 hover:bg-black/90'
            }`}
            title={language === 'en' ? 'Toggle bike lanes' : 'Afficher pistes cyclables'}
          >
            <svg className={`w-5 h-5 ${showBikeLayer ? 'text-white' : 'text-white/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 0118 0 9 9 0 01-18 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* Route Info Banner - Only show when controls are visible */}
      {route && !hideControls && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl border border-white/20 p-4 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-white/60">{language === 'en' ? 'Distance' : 'Distance'}:</span>
                <span className="font-semibold text-white ml-1">
                  {(route.distance / 1000).toFixed(1)} km
                </span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div>
                <span className="text-white/60">{language === 'en' ? 'Time' : 'Temps'}:</span>
                <span className="font-semibold text-white ml-1">
                  {Math.round(route.duration / 60)} min
                </span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div>
                <span className="text-white/60">↗</span>
                <span className="font-semibold text-white ml-1">
                  {Math.round(route.totalElevationGain)} m
                </span>
              </div>
            </div>
            
            {/* Traffic indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                route.trafficLevel === 'light' ? 'bg-white' :
                route.trafficLevel === 'moderate' ? 'bg-white/60' :
                'bg-white/40'
              }`} />
              <span className="text-xs text-white/80 capitalize">
                {route.trafficLevel} {language === 'en' ? 'traffic' : 'trafic'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

