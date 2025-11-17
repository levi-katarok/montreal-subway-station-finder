import { BikeRoutingService } from './bikeRoutingService';
import { AirQualityService } from './airQualityService';
import type { BikeRoute, ChatMessage } from '@shared/types';
import { ChatParser } from './chatParser';

/**
 * Route Orchestrator
 * Combines all services to create comprehensive bike routes with
 * elevation, traffic, and air quality analysis
 */
export class RouteOrchestrator {
  /**
   * Process a chat query and generate a complete route with all data
   */
  static async processRouteQuery(
    query: string,
    language: 'en' | 'fr'
  ): Promise<{
    route: BikeRoute | null;
    messages: ChatMessage[];
  }> {
    const messages: ChatMessage[] = [];

    try {
      // Check if it's a help query
      if (ChatParser.isHelpQuery(query)) {
        messages.push({
          role: 'assistant',
          content: ChatParser.generateHelpMessage(language),
          timestamp: Date.now(),
        });
        return { route: null, messages };
      }

      // Parse the query
      const parsed = ChatParser.parseQuery(query);

      // Validate if we can create a route
      const validation = ChatParser.canCreateRoute(parsed);
      if (!validation.valid) {
        messages.push({
          role: 'assistant',
          content: language === 'en'
            ? validation.message
            : 'Veuillez fournir un point de départ et une destination. Essayez: "McGill au Vieux-Port"',
          timestamp: Date.now(),
        });
        return { route: null, messages };
      }

      // Generate acknowledgment
      messages.push({
        role: 'assistant',
        content: ChatParser.generateAcknowledgment(parsed, language),
        timestamp: Date.now(),
      });

      // Determine origin and destination
      if (!parsed.from || !parsed.to) {
        messages.push({
          role: 'assistant',
          content: language === 'en'
            ? 'Please provide both a starting location and destination. Try: "McGill to Old Port"'
            : 'Veuillez fournir un point de départ et une destination. Essayez: "McGill au Vieux-Port"',
          timestamp: Date.now(),
        });
        return { route: null, messages };
      }

      const origin = this.normalizeLocation(parsed.from);
      const destination = this.normalizeLocation(parsed.to);

      // Convert waypoints to Google Maps format
      const waypoints = parsed.waypoints?.map(wp => ({
        location: this.normalizeLocation(wp),
        stopover: true,
      }));

      // Initialize services
      BikeRoutingService.initialize();

      // Calculate the route
      const route = await BikeRoutingService.calculateRoute(
        origin,
        destination,
        {
          ...parsed.preferences,
          waypoints,
          roundTrip: parsed.roundTrip,
        }
      );

      if (!route) {
        messages.push({
          role: 'assistant',
          content: language === 'en'
            ? 'Sorry, I couldn\'t find a bike route between those locations. Please try different locations.'
            : 'Désolé, je n\'ai pas pu trouver d\'itinéraire vélo entre ces emplacements. Veuillez essayer d\'autres emplacements.',
          timestamp: Date.now(),
        });
        return { route: null, messages };
      }

      // Enhance route with air quality data
      const enhancedRoute = await this.enhanceRouteWithAirQuality(route);

      // Generate route summary
      messages.push({
        role: 'assistant',
        content: ChatParser.generateRouteSummary(enhancedRoute, language),
        timestamp: Date.now(),
        metadata: {
          routeId: enhancedRoute.id,
        },
      });

      // Add specific recommendations based on conditions
      const recommendations = this.generateRecommendations(enhancedRoute, language);
      if (recommendations) {
        messages.push({
          role: 'assistant',
          content: recommendations,
          timestamp: Date.now(),
        });
      }

      return { route: enhancedRoute, messages };

    } catch (error) {
      console.error('Error processing route query:', error);
      messages.push({
        role: 'assistant',
        content: language === 'en'
          ? 'Sorry, I encountered an error while planning your route. Please try again.'
          : 'Désolé, j\'ai rencontré une erreur lors de la planification de votre itinéraire. Veuillez réessayer.',
        timestamp: Date.now(),
      });
      return { route: null, messages };
    }
  }

  /**
   * Normalize location string for Google Maps
   */
  private static normalizeLocation(location: string): string {
    // Add Montreal context if not already specified
    if (!location.toLowerCase().includes('montreal') && 
        !location.toLowerCase().includes('montréal')) {
      return `${location}, Montreal, QC, Canada`;
    }
    return location;
  }

  /**
   * Enhance route with air quality data
   */
  private static async enhanceRouteWithAirQuality(route: BikeRoute): Promise<BikeRoute> {
    try {
      // Get air quality for start and end points
      const startLocation = route.segments[0]?.startLocation;
      const endLocation = route.segments[route.segments.length - 1]?.endLocation;

      if (startLocation && endLocation) {
        const airQualityData = await AirQualityService.getRouteAirQuality(
          startLocation,
          endLocation
        );

        // Update air quality score based on actual data
        const score = AirQualityService.calculateScore(airQualityData.average);
        
        return {
          ...route,
          airQualityScore: score,
        };
      }
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    }

    return route;
  }

  /**
   * Generate contextual recommendations
   */
  private static generateRecommendations(route: BikeRoute, language: 'en' | 'fr'): string | null {
    const recommendations: string[] = [];

    // Traffic recommendations
    if (route.trafficLevel === 'heavy') {
      recommendations.push(
        language === 'en'
          ? '🚦 High traffic expected. Consider cycling during off-peak hours (10 AM - 3 PM or after 7 PM).'
          : '🚦 Trafic dense prévu. Considérez de faire du vélo pendant les heures creuses (10h - 15h ou après 19h).'
      );
    }

    // Elevation recommendations
    if (route.totalElevationGain > 100) {
      recommendations.push(
        language === 'en'
          ? `⛰️ This route has ${Math.round(route.totalElevationGain)}m of climbing. Take breaks and stay hydrated!`
          : `⛰️ Cet itinéraire comporte ${Math.round(route.totalElevationGain)}m de montée. Prenez des pauses et restez hydraté!`
      );
    } else if (route.totalElevationGain < 20) {
      recommendations.push(
        language === 'en'
          ? '✨ This is a relatively flat route - perfect for a relaxed ride!'
          : '✨ C\'est un itinéraire relativement plat - parfait pour une balade détendue!'
      );
    }

    // Air quality recommendations
    if (route.airQualityScore < 5) {
      recommendations.push(
        language === 'en'
          ? '🌬️ Air quality is not ideal. Consider wearing a mask or choosing another time.'
          : '🌬️ La qualité de l\'air n\'est pas idéale. Considérez de porter un masque ou choisir un autre moment.'
      );
    } else if (route.airQualityScore >= 8) {
      recommendations.push(
        language === 'en'
          ? '🌬️ Excellent air quality! Great conditions for cycling.'
          : '🌬️ Excellente qualité de l\'air! Conditions parfaites pour le vélo.'
      );
    }

    // Safety recommendations
    if (route.safetyScore < 70) {
      recommendations.push(
        language === 'en'
          ? '🛡️ This route may have limited bike infrastructure. Stay alert and follow traffic rules.'
          : '🛡️ Cet itinéraire peut avoir une infrastructure cyclable limitée. Restez vigilant et suivez le code de la route.'
      );
    }

    // Duration recommendations
    if (route.duration > 3600) { // More than 1 hour
      recommendations.push(
        language === 'en'
          ? '⏱️ This is a longer ride. Bring water, snacks, and check your bike before leaving.'
          : '⏱️ C\'est une longue balade. Apportez de l\'eau, des collations et vérifiez votre vélo avant de partir.'
      );
    }

    if (recommendations.length === 0) {
      return null;
    }

    const header = language === 'en' ? '💡 Tips & Recommendations:\n\n' : '💡 Conseils et recommandations:\n\n';
    return header + recommendations.join('\n\n');
  }

  /**
   * Compare multiple routes
   */
  static compareRoutes(routes: BikeRoute[]): {
    fastest: BikeRoute;
    flattest: BikeRoute;
    safest: BikeRoute;
    bestAirQuality: BikeRoute;
  } {
    if (routes.length === 0) {
      throw new Error('No routes to compare');
    }

    return {
      fastest: routes.reduce((prev, current) => 
        current.duration < prev.duration ? current : prev
      ),
      flattest: routes.reduce((prev, current) =>
        current.totalElevationGain < prev.totalElevationGain ? current : prev
      ),
      safest: routes.reduce((prev, current) =>
        current.safetyScore > prev.safetyScore ? current : prev
      ),
      bestAirQuality: routes.reduce((prev, current) =>
        current.airQualityScore > prev.airQualityScore ? current : prev
      ),
    };
  }
}

