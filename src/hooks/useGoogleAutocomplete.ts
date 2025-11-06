import { useEffect, useRef } from 'react';

interface UseGoogleAutocompleteOptions {
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
}

export function useGoogleAutocomplete(options: UseGoogleAutocompleteOptions = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Wait for Google Maps to load
    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) {
        return;
      }

      try {
        // Create autocomplete instance
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'ca' },
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(45.4, -73.8),
            new google.maps.LatLng(45.7, -73.4)
          ),
          fields: ['geometry', 'formatted_address', 'name', 'place_id'],
        });

        // Handle place selection
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && options.onPlaceSelected) {
            options.onPlaceSelected(place);
          }
        });

        autocompleteRef.current = autocomplete;
      } catch (error) {
        console.error('Failed to initialize Google Autocomplete:', error);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      initAutocomplete();
    } else {
      // Wait for Google Maps to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          initAutocomplete();
          clearInterval(checkInterval);
        }
      }, 100);

      // Clean up interval after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);

      return () => clearInterval(checkInterval);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [options.onPlaceSelected]);

  return inputRef;
}
