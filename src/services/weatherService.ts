// ============================================================================
// ENHANCED WEATHER & AIR QUALITY SERVICE - WeatherAPI.com Integration
// ============================================================================

import type {
  WeatherData,
  WeatherCondition,
  WeatherRecommendation,
} from '../types';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHERAPI_KEY || '7728de99273a4c0186e151255250511';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1';
const MONTREAL_LOCATION = 'Montreal,Canada';

// Cache weather data for 10 minutes
let weatherCache: { data: WeatherData; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// ============================================================================
// AIR QUALITY INDICES
// ============================================================================

export interface AirQualityData {
  aqi: number; // US EPA AQI
  pm2_5: number; // PM2.5 (μg/m³)
  pm10: number; // PM10 (μg/m³)
  co: number; // Carbon Monoxide (μg/m³)
  no2: number; // Nitrogen Dioxide (μg/m³)
  o3: number; // Ozone (μg/m³)
  so2: number; // Sulfur Dioxide (μg/m³)
  defra: number; // UK DEFRA Index
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  healthMessage: string;
}

export interface EnhancedWeatherData extends WeatherData {
  airQuality: AirQualityData;
  visibility: number; // km
  uvIndex: number;
  recommendations: {
    outdoor: 'safe' | 'caution' | 'avoid';
    sensitive: 'safe' | 'caution' | 'avoid';
    message: string;
    messageFr: string;
  };
}

interface WeatherAPIResponse {
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    humidity: number;
    precip_mm: number;
    vis_km: number;
    uv: number;
    air_quality: {
      co: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      'us-epa-index': number;
      'gb-defra-index': number;
    };
  };
  location: {
    name: string;
    region: string;
    localtime: string;
  };
}

export class WeatherService {
  /**
   * Fetch current weather and air quality for Montreal
   */
  static async getCurrentWeather(): Promise<EnhancedWeatherData | null> {
    // Check cache first
    if (weatherCache && Date.now() - weatherCache.timestamp < CACHE_DURATION) {
      return weatherCache.data as EnhancedWeatherData;
    }

    try {
      const response = await fetch(
        `${WEATHER_API_URL}/current.json?key=${WEATHER_API_KEY}&q=${MONTREAL_LOCATION}&aqi=yes`
      );

      if (!response.ok) {
        console.error('Weather API error:', response.statusText);
        return null;
      }

      const data: WeatherAPIResponse = await response.json();
      const weatherData = this.parseWeatherResponse(data);

      // Update cache
      weatherCache = {
        data: weatherData,
        timestamp: Date.now(),
      };

      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      return null;
    }
  }

  /**
   * Parse WeatherAPI.com response
   */
  private static parseWeatherResponse(data: WeatherAPIResponse): EnhancedWeatherData {
    const condition = this.mapWeatherCondition(data.current.condition.text);
    const airQualityData = this.parseAirQuality(data.current.air_quality);

    const baseWeather: WeatherData = {
      temperature: Math.round(data.current.temp_c),
      feelsLike: Math.round(data.current.feelslike_c),
      condition,
      description: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: Math.round(data.current.wind_kph),
      precipitation: data.current.precip_mm,
      timestamp: new Date(data.location.localtime).getTime(),
    };

    return {
      ...baseWeather,
      airQuality: airQualityData,
      visibility: data.current.vis_km,
      uvIndex: data.current.uv,
      recommendations: this.getHealthRecommendations(baseWeather, airQualityData),
    };
  }

  /**
   * Parse air quality data from WeatherAPI
   */
  private static parseAirQuality(aq: WeatherAPIResponse['current']['air_quality']): AirQualityData {
    const aqi = aq['us-epa-index'];
    const category = this.getAQICategory(aqi);
    const healthMessage = this.getAQIHealthMessage(aqi);

    return {
      aqi,
      pm2_5: aq.pm2_5,
      pm10: aq.pm10,
      co: aq.co,
      no2: aq.no2,
      o3: aq.o3,
      so2: aq.so2,
      defra: aq['gb-defra-index'],
      category,
      healthMessage,
    };
  }

  /**
   * Get AQI category based on US EPA standards
   */
  private static getAQICategory(aqi: number): AirQualityData['category'] {
    if (aqi <= 1) return 'Good';
    if (aqi <= 2) return 'Moderate';
    if (aqi <= 3) return 'Unhealthy for Sensitive';
    if (aqi <= 4) return 'Unhealthy';
    if (aqi <= 5) return 'Very Unhealthy';
    return 'Hazardous';
  }

  /**
   * Get health message for AQI level
   */
  private static getAQIHealthMessage(aqi: number): string {
    if (aqi <= 1) return 'Air quality is satisfactory, and air pollution poses little or no risk.';
    if (aqi <= 2) return 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
    if (aqi <= 3) return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    if (aqi <= 4) return 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
    if (aqi <= 5) return 'Health alert: The risk of health effects is increased for everyone.';
    return 'Health warning of emergency conditions: everyone is more likely to be affected.';
  }

  /**
   * Map weather condition to simplified types
   */
  private static mapWeatherCondition(condition: string): WeatherCondition {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'rain';
    if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('blizzard')) return 'snow';
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return 'clear';
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return 'extreme';
    return 'clouds';
  }

  /**
   * Get comprehensive health recommendations
   */
  private static getHealthRecommendations(
    weather: WeatherData,
    airQuality: AirQualityData
  ): EnhancedWeatherData['recommendations'] {
    let outdoor: 'safe' | 'caution' | 'avoid' = 'safe';
    let sensitive: 'safe' | 'caution' | 'avoid' = 'safe';
    let message = '';
    let messageFr = '';

    // Air quality assessment (highest priority)
    if (airQuality.aqi >= 4) {
      outdoor = 'avoid';
      sensitive = 'avoid';
      message = '⚠️ Unhealthy air quality. Avoid outdoor activities. Use indoor metro routes.';
      messageFr = '⚠️ Qualité de l\'air malsaine. Évitez les activités extérieures. Utilisez les routes de métro intérieures.';
    } else if (airQuality.aqi >= 3) {
      outdoor = 'caution';
      sensitive = 'avoid';
      message = '⚠️ Unhealthy air for sensitive groups. Prefer indoor routes and metro.';
      messageFr = '⚠️ Air malsain pour les groupes sensibles. Préférez les routes intérieures et le métro.';
    } else if (airQuality.aqi >= 2) {
      sensitive = 'caution';
      message = '💡 Moderate air quality. Sensitive individuals should limit prolonged outdoor exposure.';
      messageFr = '💡 Qualité de l\'air modérée. Les personnes sensibles devraient limiter l\'exposition prolongée à l\'extérieur.';
    }

    // Weather conditions (secondary)
    if (weather.condition === 'extreme') {
      outdoor = 'avoid';
      sensitive = 'avoid';
      message = '⚠️ Extreme weather! Stay indoors. Use metro system.';
      messageFr = '⚠️ Conditions météorologiques extrêmes! Restez à l\'intérieur. Utilisez le système de métro.';
    } else if (weather.temperature < -20) {
      outdoor = 'avoid';
      sensitive = 'avoid';
      message = '❄️ Extreme cold! Use heated metro connections and indoor routes.';
      messageFr = '❄️ Froid extrême! Utilisez les connexions de métro chauffées et les routes intérieures.';
    } else if (weather.temperature < -10) {
      outdoor = 'caution';
      sensitive = 'avoid';
      message = '🥶 Very cold. Prefer indoor routes. Limit outdoor walking.';
      messageFr = '🥶 Très froid. Préférez les routes intérieures. Limitez la marche extérieure.';
    } else if (weather.condition === 'snow' && weather.precipitation > 5) {
      outdoor = 'caution';
      sensitive = 'caution';
      message = '🌨️ Heavy snow. Use metro over walking/biking. Slippery conditions.';
      messageFr = '🌨️ Neige forte. Utilisez le métro plutôt que marcher/vélo. Conditions glissantes.';
    } else if (weather.condition === 'rain' && weather.precipitation > 5) {
      outdoor = 'caution';
      message = '🌧️ Heavy rain. Prefer covered routes and metro connections.';
      messageFr = '🌧️ Pluie forte. Préférez les routes couvertes et les connexions de métro.';
    }

    // Good conditions
    if (!message && airQuality.aqi === 1 && weather.temperature > 15 && weather.temperature < 25) {
      message = '✅ Excellent conditions! Perfect for walking or biking.';
      messageFr = '✅ Conditions excellentes! Parfait pour marcher ou faire du vélo.';
    } else if (!message) {
      message = '✓ Good conditions for outdoor travel.';
      messageFr = '✓ Bonnes conditions pour les déplacements extérieurs.';
    }

    return { outdoor, sensitive, message, messageFr };
  }

  /**
   * Get travel recommendations based on weather and air quality
   */
  static getWeatherRecommendations(weather: EnhancedWeatherData): WeatherRecommendation {
    const { outdoor, sensitive } = weather.recommendations;

    return {
      preferIndoor: outdoor === 'avoid' || outdoor === 'caution',
      avoidBiking: weather.condition === 'rain' || weather.condition === 'snow' || outdoor === 'avoid',
      suggestDriving: outdoor === 'avoid' || weather.temperature < -15,
      message: weather.recommendations.message,
      messageFr: weather.recommendations.messageFr,
    };
  }

  /**
   * Adjust travel time based on weather and air quality
   */
  static adjustTravelTime(
    baseTime: number,
    mode: 'walking' | 'biking',
    weather: EnhancedWeatherData
  ): { adjustedTime: number; reason: string; reasonFr: string } {
    let multiplier = 1.0;
    let reason = '';
    let reasonFr = '';

    // Air quality impact
    if (weather.airQuality.aqi >= 3) {
      multiplier = mode === 'walking' ? 1.2 : 1.4;
      reason = 'Poor air quality slows travel';
      reasonFr = 'Mauvaise qualité de l\'air ralentit le voyage';
    }

    // Cold weather adjustments
    if (weather.temperature < -20) {
      multiplier = Math.max(multiplier, mode === 'walking' ? 1.3 : 1.5);
      reason = 'Extreme cold slows travel';
      reasonFr = 'Froid extrême ralentit le voyage';
    } else if (weather.temperature < -10) {
      multiplier = Math.max(multiplier, mode === 'walking' ? 1.15 : 1.3);
      reason = 'Cold weather slows travel';
      reasonFr = 'Temps froid ralentit le voyage';
    }

    // Precipitation adjustments
    if (weather.condition === 'rain' || weather.condition === 'snow') {
      if (weather.precipitation > 5) {
        multiplier = Math.max(multiplier, mode === 'walking' ? 1.25 : 1.5);
        reason = 'Heavy precipitation slows travel';
        reasonFr = 'Précipitations fortes ralentissent le voyage';
      } else {
        multiplier = Math.max(multiplier, 1.1);
        reason = 'Wet conditions slow travel';
        reasonFr = 'Conditions humides ralentissent le voyage';
      }
    }

    // Wind adjustments for biking
    if (mode === 'biking' && weather.windSpeed > 30) {
      multiplier = Math.max(multiplier, 1.2);
      reason = 'Strong winds slow biking';
      reasonFr = 'Vents forts ralentissent le vélo';
    }

    // Visibility impact
    if (weather.visibility < 1) {
      multiplier = Math.max(multiplier, 1.15);
      reason = 'Poor visibility slows travel';
      reasonFr = 'Mauvaise visibilité ralentit le voyage';
    }

    return {
      adjustedTime: Math.round(baseTime * multiplier),
      reason: multiplier > 1 ? reason : '',
      reasonFr: multiplier > 1 ? reasonFr : '',
    };
  }

  /**
   * Get weather icon for display
   */
  static getWeatherIcon(condition: WeatherCondition, airQuality?: AirQualityData): string {
    // If air quality is bad, show warning icon
    if (airQuality && airQuality.aqi >= 3) {
      return '🌫️'; // Poor air quality
    }

    const icons: Record<WeatherCondition, string> = {
      clear: '☀️',
      clouds: '⛅',
      rain: '🌧️',
      snow: '❄️',
      extreme: '⚠️',
    };
    return icons[condition] || '🌤️';
  }

  /**
   * Get air quality color for UI
   */
  static getAQIColor(aqi: number): string {
    if (aqi <= 1) return '#00e400'; // Green
    if (aqi <= 2) return '#ffff00'; // Yellow
    if (aqi <= 3) return '#ff7e00'; // Orange
    if (aqi <= 4) return '#ff0000'; // Red
    if (aqi <= 5) return '#8f3f97'; // Purple
    return '#7e0023'; // Maroon
  }

  /**
   * Format temperature for display
   */
  static formatTemperature(temp: number, useCelsius: boolean = true): string {
    if (useCelsius) {
      return `${temp}°C`;
    }
    const fahrenheit = Math.round((temp * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }

  /**
   * Get detailed air quality breakdown
   */
  static getAirQualityBreakdown(aq: AirQualityData): {
    pollutant: string;
    value: number;
    unit: string;
    level: 'low' | 'moderate' | 'high';
  }[] {
    return [
      {
        pollutant: 'PM2.5',
        value: Math.round(aq.pm2_5),
        unit: 'μg/m³',
        level: aq.pm2_5 < 12 ? 'low' : aq.pm2_5 < 35 ? 'moderate' : 'high',
      },
      {
        pollutant: 'PM10',
        value: Math.round(aq.pm10),
        unit: 'μg/m³',
        level: aq.pm10 < 50 ? 'low' : aq.pm10 < 150 ? 'moderate' : 'high',
      },
      {
        pollutant: 'O₃',
        value: Math.round(aq.o3),
        unit: 'μg/m³',
        level: aq.o3 < 100 ? 'low' : aq.o3 < 160 ? 'moderate' : 'high',
      },
      {
        pollutant: 'NO₂',
        value: Math.round(aq.no2),
        unit: 'μg/m³',
        level: aq.no2 < 40 ? 'low' : aq.no2 < 100 ? 'moderate' : 'high',
      },
    ];
  }
}
