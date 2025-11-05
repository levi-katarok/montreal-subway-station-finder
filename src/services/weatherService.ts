// ============================================================================
// WEATHER SERVICE - OpenWeatherMap Integration
// ============================================================================

import type {
  WeatherData,
  WeatherCondition,
  WeatherRecommendation,
  WeatherAPIResponse,
} from '../types';

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const MONTREAL_LAT = 45.5017;
const MONTREAL_LON = -73.5673;

// Cache weather data for 10 minutes
let weatherCache: { data: WeatherData; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export class WeatherService {
  /**
   * Fetch current weather for Montreal
   */
  static async getCurrentWeather(): Promise<WeatherData | null> {
    // Check cache first
    if (
      weatherCache &&
      Date.now() - weatherCache.timestamp < CACHE_DURATION
    ) {
      return weatherCache.data;
    }

    try {
      const response = await fetch(
        `${WEATHER_API_URL}?lat=${MONTREAL_LAT}&lon=${MONTREAL_LON}&units=metric&appid=${WEATHER_API_KEY}`
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
   * Parse OpenWeatherMap API response
   */
  private static parseWeatherResponse(
    data: WeatherAPIResponse
  ): WeatherData {
    const condition = this.mapWeatherCondition(data.weather[0].main);
    const precipitation =
      (data.rain?.['1h'] || 0) + (data.snow?.['1h'] || 0);

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      precipitation,
      timestamp: data.dt * 1000,
    };
  }

  /**
   * Map OpenWeatherMap condition to our simplified types
   */
  private static mapWeatherCondition(
    condition: string
  ): WeatherCondition {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle'))
      return 'rain';
    if (conditionLower.includes('snow')) return 'snow';
    if (conditionLower.includes('clear')) return 'clear';
    if (conditionLower.includes('extreme')) return 'extreme';
    return 'clouds';
  }

  /**
   * Get travel recommendations based on weather
   */
  static getWeatherRecommendations(
    weather: WeatherData
  ): WeatherRecommendation {
    let preferIndoor = false;
    let avoidBiking = false;
    let suggestDriving = false;
    let message = '';
    let messageFr = '';

    // Cold weather
    if (weather.temperature < -15) {
      preferIndoor = true;
      suggestDriving = true;
      message = 'Very cold! Consider using indoor connections or driving.';
      messageFr =
        'Très froid! Considérez les connexions intérieures ou conduire.';
    } else if (weather.temperature < -5) {
      preferIndoor = true;
      message = 'Cold weather. Indoor routes recommended.';
      messageFr = 'Temps froid. Routes intérieures recommandées.';
    }

    // Rain
    if (weather.condition === 'rain') {
      preferIndoor = true;
      avoidBiking = true;
      if (weather.precipitation > 5) {
        suggestDriving = true;
        message = 'Heavy rain. Use covered routes or consider driving.';
        messageFr =
          'Pluie forte. Utilisez des routes couvertes ou considérez conduire.';
      } else {
        message = 'Rainy weather. Indoor connections recommended.';
        messageFr = 'Temps pluvieux. Connexions intérieures recommandées.';
      }
    }

    // Snow
    if (weather.condition === 'snow') {
      preferIndoor = true;
      avoidBiking = true;
      if (weather.precipitation > 3) {
        suggestDriving = true;
        message = 'Heavy snow. Metro recommended over walking/biking.';
        messageFr =
          'Neige forte. Métro recommandé plutôt que marcher/vélo.';
      } else {
        message = 'Snowy weather. Take care if walking or biking.';
        messageFr = 'Temps neigeux. Soyez prudent si vous marchez ou faites du vélo.';
      }
    }

    // Extreme weather
    if (weather.condition === 'extreme') {
      preferIndoor = true;
      avoidBiking = true;
      suggestDriving = true;
      message = 'Extreme weather! Stay indoors if possible.';
      messageFr = 'Conditions extrêmes! Restez à l\'intérieur si possible.';
    }

    // Hot weather
    if (weather.temperature > 30) {
      message = 'Very hot! Stay hydrated and use air-conditioned metro.';
      messageFr =
        'Très chaud! Restez hydraté et utilisez le métro climatisé.';
    }

    // Nice weather - encourage outdoor options
    if (
      weather.temperature > 15 &&
      weather.temperature < 25 &&
      weather.condition === 'clear'
    ) {
      message = 'Perfect weather for walking or biking!';
      messageFr = 'Temps parfait pour marcher ou faire du vélo!';
    }

    // Default message if no specific conditions
    if (!message) {
      message = 'Moderate weather. All transit options available.';
      messageFr = 'Temps modéré. Toutes les options de transport disponibles.';
    }

    return {
      preferIndoor,
      avoidBiking,
      suggestDriving,
      message,
      messageFr,
    };
  }

  /**
   * Adjust travel time based on weather
   */
  static adjustTravelTime(
    baseTime: number,
    mode: 'walking' | 'biking',
    weather: WeatherData
  ): { adjustedTime: number; reason: string; reasonFr: string } {
    let multiplier = 1.0;
    let reason = '';
    let reasonFr = '';

    // Cold weather adjustments
    if (weather.temperature < -20) {
      multiplier = mode === 'walking' ? 1.3 : 1.5;
      reason = 'Extreme cold slows travel';
      reasonFr = 'Froid extrême ralentit le voyage';
    } else if (weather.temperature < -10) {
      multiplier = mode === 'walking' ? 1.15 : 1.3;
      reason = 'Cold weather slows travel';
      reasonFr = 'Temps froid ralentit le voyage';
    }

    // Rain/snow adjustments
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

    return {
      adjustedTime: Math.round(baseTime * multiplier),
      reason: multiplier > 1 ? reason : '',
      reasonFr: multiplier > 1 ? reasonFr : '',
    };
  }

  /**
   * Get weather icon based on condition
   */
  static getWeatherIcon(condition: WeatherCondition): string {
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
   * Format temperature for display
   */
  static formatTemperature(temp: number, useCelsius: boolean = true): string {
    if (useCelsius) {
      return `${temp}°C`;
    }
    const fahrenheit = Math.round((temp * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }
}
