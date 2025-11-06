// ============================================================================
// TYPE DEFINITIONS - Montreal Transit Explorer
// ============================================================================

export type Language = 'en' | 'fr';

export type MetroLine = 'green' | 'orange' | 'blue' | 'yellow';

export type TransitType =
  | 'metro'
  | 'rem'
  | 'train'
  | 'bus'
  | 'parking';

export type TravelMode = 'WALKING' | 'BICYCLING' | 'DRIVING' | 'TRANSIT';

export type WeatherCondition =
  | 'clear'
  | 'rain'
  | 'snow'
  | 'clouds'
  | 'extreme';

// ============================================================================
// STATION INTERFACES
// ============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BaseStation {
  id: string;
  name: string;
  nameFr?: string;
  location: Coordinates;
  accessible: boolean;
  type: TransitType;
}

export interface MetroStation extends BaseStation {
  type: 'metro';
  line: MetroLine | MetroLine[];
  exits?: StationExit[];
  facilities?: StationFacility[];
  connections?: TransitConnection[];
}

export interface REMStation extends BaseStation {
  type: 'rem';
  line: 'rem';
  zone?: number;
}

export interface TrainStation extends BaseStation {
  type: 'train';
  lines: string[]; // e.g., ['Deux-Montagnes', 'Saint-Jérôme']
}

export interface ParkingLocation extends BaseStation {
  type: 'parking';
  spots: number;
  rate?: string;
  nearbyStations: string[]; // station IDs
}

export type Station = MetroStation | REMStation | TrainStation | ParkingLocation;

// ============================================================================
// STATION DETAILS
// ============================================================================

export interface StationExit {
  name: string;
  location: Coordinates;
  indoor: boolean;
  heatedConnection?: boolean;
}

export interface StationFacility {
  type: 'bathroom' | 'wifi' | 'shops' | 'atm' | 'parking' | 'bixi' | 'elevator';
  available: boolean;
  notes?: string;
}

export interface TransitConnection {
  stationId: string;
  type: TransitType;
  walkingTime: number; // in minutes
  distance: number; // in meters
  indoor: boolean;
  accessible: boolean;
}

// ============================================================================
// TRANSFER INFORMATION
// ============================================================================

export interface TransferInfo {
  fromStation: string;
  toStation: string;
  fromLine: MetroLine | 'rem' | string;
  toLine: MetroLine | 'rem' | string;
  walkingTime: number; // minutes
  distance: number; // meters
  accessible: boolean;
  indoor: boolean;
  directions?: string;
}

// ============================================================================
// JOURNEY PLANNING
// ============================================================================

export interface JourneySegment {
  type: 'walk' | 'metro' | 'rem' | 'train' | 'bus' | 'drive' | 'bike';
  from: string;
  to: string;
  duration: number; // minutes
  distance: number; // meters
  instructions?: string;
  line?: string;
  cost?: number;
}

export interface MultiModalRoute {
  segments: JourneySegment[];
  totalDuration: number;
  totalDistance: number;
  totalCost: number;
  weatherAdjusted: boolean;
  recommendation: 'best' | 'fastest' | 'cheapest' | 'accessible';
}

// ============================================================================
// WEATHER
// ============================================================================

export interface WeatherData {
  temperature: number; // Celsius
  feelsLike: number;
  condition: WeatherCondition;
  description: string;
  humidity: number;
  windSpeed: number; // km/h
  precipitation: number; // mm
  timestamp: number;
}

export interface WeatherRecommendation {
  preferIndoor: boolean;
  avoidBiking: boolean;
  suggestDriving: boolean;
  message: string;
  messageFr: string;
}

// ============================================================================
// SEARCH & RESULTS
// ============================================================================

export interface SearchResult {
  station: Station;
  distance: string;
  duration: string;
  travelMode: TravelMode;
  weatherImpact?: string;
  isTransfer: boolean;
  alternatives?: AlternativeRoute[];
}

export interface AlternativeRoute {
  description: string;
  duration: number;
  type: 'indoor' | 'covered' | 'direct';
}

// ============================================================================
// USER PREFERENCES
// ============================================================================

export interface UserPreferences {
  language: Language;
  accessibleOnly: boolean;
  preferIndoor: boolean;
  savedLocations: SavedLocation[];
}

export interface SavedLocation {
  id: string;
  address: string;
  name?: string;
  coordinates: Coordinates;
  timestamp: number;
}

// ============================================================================
// LINE DATA
// ============================================================================

export interface LineData {
  name: string;
  nameFr: string;
  color: string;
  coordinates: Coordinates[];
  type: 'metro' | 'rem';
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      status: string;
    }>;
  }>;
  status: string;
}

export interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
}
