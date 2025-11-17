// Custom Google Maps styling - Soft pink/cream theme
export const mapStyles = [
  // Hide all POI labels for cleaner look
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  // Hide business icons
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  // Style water features with soft blue
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      { color: '#C5D9E8' }, // Soft blue
      { lightness: 17 },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#7C9EB2' },
      { lightness: 10 },
    ],
  },
  // Landscape - soft pink/cream tones
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#FFF5F0' }, // Soft cream
      { lightness: 20 },
    ],
  },
  // Parks and green spaces - soft mint
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      { color: '#E8F5E9' }, // Very soft green
      { lightness: 50 },
    ],
  },
  // Roads - soft gray/pink
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#FFE4E1' }, // Misty rose
      { lightness: 17 },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#FFD6D1' },
      { lightness: 29 },
      { weight: 0.5 },
    ],
  },
  // Arterial roads
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      { color: '#FFF0EB' }, // Very soft pink
      { lightness: 18 },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8B6B61' }], // Soft brown
  },
  // Local roads
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      { color: '#FFFBF5' }, // Almost white cream
      { lightness: 16 },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9E9E9E' }],
  },
  // Transit stations - hide default markers
  {
    featureType: 'transit.station',
    stylers: [{ visibility: 'off' }],
  },
  // Transit lines - make subtle
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      { color: '#E5E5E5' },
      { lightness: 29 },
      { weight: 0.5 },
    ],
  },
  // Administrative boundaries - soft
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#FFDAB9' }, // Peach puff
      { lightness: 17 },
      { weight: 0.8 },
    ],
  },
  // Buildings - soft gray/pink
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      { color: '#E8F5E9' }, // Soft mint green
      { lightness: 21 },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#689F38' }],
  },
  // Labels - soft brown text
  {
    elementType: 'labels.text.stroke',
    stylers: [
      { visibility: 'on' },
      { color: '#FFFFFF' }, // White stroke for readability
      { lightness: 16 },
      { weight: 3 },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      { saturation: 36 },
      { color: '#6B4E3D' }, // Soft brown
      { lightness: 20 },
    ],
  },
  // Icons
  {
    elementType: 'labels.icon',
    stylers: [
      { visibility: 'off' }, // Hide default icons
    ],
  },
];
