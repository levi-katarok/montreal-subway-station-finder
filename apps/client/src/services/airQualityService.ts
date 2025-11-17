import type { AirQualityData, Coordinates } from '@shared/types';

/**
 * Air Quality Service
 * Fetches and analyzes air quality data for locations
 */
export class AirQualityService {
  private static readonly WEATHER_API_KEY = 'bc2c2758aeaf44c793785821252711';
  private static readonly BASE_URL = 'https://api.weatherapi.com/v1';

  /**
   * Get current air quality for a location
   */
  static async getAirQuality(location: Coordinates): Promise<AirQualityData | null> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/current.json?key=${this.WEATHER_API_KEY}&q=${location.lat},${location.lng}&aqi=yes`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.current.air_quality) {
        console.warn('No air quality data available');
        return null;
      }

      const aqData = data.current.air_quality;
      const usEpaIndex = aqData['us-epa-index'];

      return {
        aqi: usEpaIndex,
        category: this.getAQICategory(usEpaIndex),
        pollutants: {
          pm25: aqData.pm2_5,
          pm10: aqData.pm10,
          o3: aqData.o3,
          no2: aqData.no2,
          so2: aqData.so2,
          co: aqData.co,
        },
        location,
        timestamp: Date.now(),
        recommendations: this.getRecommendations(usEpaIndex),
      };
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      return null;
    }
  }

  /**
   * Get air quality along a route (simplified)
   * In production, would sample multiple points along the route
   */
  static async getRouteAirQuality(
    startLocation: Coordinates,
    endLocation: Coordinates
  ): Promise<{ start: AirQualityData | null; end: AirQualityData | null; average: number }> {
    const [startAQ, endAQ] = await Promise.all([
      this.getAirQuality(startLocation),
      this.getAirQuality(endLocation),
    ]);

    let averageAQI = 0;
    let count = 0;

    if (startAQ) {
      averageAQI += startAQ.aqi;
      count++;
    }
    if (endAQ) {
      averageAQI += endAQ.aqi;
      count++;
    }

    return {
      start: startAQ,
      end: endAQ,
      average: count > 0 ? averageAQI / count : 5, // Default moderate if no data
    };
  }

  /**
   * Convert EPA AQI index to category
   */
  private static getAQICategory(index: number): AirQualityData['category'] {
    if (index === 1) return 'good';
    if (index === 2) return 'moderate';
    if (index === 3) return 'unhealthy-sensitive';
    if (index === 4) return 'unhealthy';
    if (index === 5) return 'very-unhealthy';
    return 'hazardous';
  }

  /**
   * Get health recommendations based on AQI
   */
  private static getRecommendations(index: number): string[] {
    const recommendations: Record<number, string[]> = {
      1: [
        'Air quality is excellent - great for outdoor cycling',
        'No health concerns for any group',
      ],
      2: [
        'Air quality is acceptable',
        'Unusually sensitive people should consider reducing prolonged outdoor exertion',
      ],
      3: [
        'Members of sensitive groups may experience health effects',
        'Consider reducing prolonged outdoor exertion',
        'The general public is less likely to be affected',
      ],
      4: [
        'Everyone may begin to experience health effects',
        'Members of sensitive groups may experience more serious effects',
        'Consider avoiding prolonged outdoor exertion',
      ],
      5: [
        'Health alert: everyone may experience more serious effects',
        'Avoid outdoor exertion',
        'Consider indoor alternatives',
      ],
      6: [
        'Health warning of emergency conditions',
        'Everyone should avoid all outdoor exertion',
        'Stay indoors if possible',
      ],
    };

    return recommendations[index] || recommendations[2];
  }

  /**
   * Calculate air quality score (1-10 scale) from EPA index
   */
  static calculateScore(epaIndex: number): number {
    // EPA index is 1-6, we convert to 1-10 scale
    // 1 (Good) = 10, 6 (Hazardous) = 1
    return Math.max(1, Math.min(10, 11 - epaIndex * 1.5));
  }

  /**
   * Get color representation for AQI
   */
  static getAQIColor(index: number): string {
    const colors: Record<number, string> = {
      1: '#00E400', // Green - Good
      2: '#FFFF00', // Yellow - Moderate
      3: '#FF7E00', // Orange - Unhealthy for Sensitive
      4: '#FF0000', // Red - Unhealthy
      5: '#8F3F97', // Purple - Very Unhealthy
      6: '#7E0023', // Maroon - Hazardous
    };

    return colors[index] || colors[2];
  }
}

