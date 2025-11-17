// ============================================================================
// MULTI-MODAL JOURNEY PLANNER
// Combines Metro, REM, Train, Bus, Walking, Biking, and Driving
// ============================================================================

import type {
  MultiModalRoute,
  JourneySegment,
  Station,
  Coordinates,
  WeatherData,
} from '@shared/types';
import { allStations, transferInfo } from '../data/stationsData';
import { WeatherService } from './weatherService';

export class MultiModalPlanner {
  /**
   * Plan a multi-modal journey from origin to destination
   */
  static async planJourney(
    origin: Coordinates,
    destination: string, // Station ID
    options: {
      allowDriving?: boolean;
      requireAccessible?: boolean;
      preferIndoor?: boolean;
      weather?: WeatherData;
    } = {}
  ): Promise<MultiModalRoute[]> {
    const routes: MultiModalRoute[] = [];
    const targetStation = allStations.find((s) => s.id === destination);

    if (!targetStation) {
      throw new Error('Destination station not found');
    }

    // Route 1: Direct walking/biking to station
    const directRoute = await this.planDirectRoute(origin, targetStation, options.weather);
    if (directRoute) routes.push(directRoute);

    // Route 2: Drive + Park + Metro
    if (options.allowDriving) {
      const parkAndRideRoute = await this.planParkAndRide(origin, targetStation, options);
      if (parkAndRideRoute) routes.push(parkAndRideRoute);
    }

    // Route 3: Walk + Bus + Metro
    const busMetroRoute = await this.planBusMetroRoute(origin, targetStation, options);
    if (busMetroRoute) routes.push(busMetroRoute);

    // Route 4: REM connections
    const remRoute = await this.planREMRoute(origin, targetStation, options);
    if (remRoute) routes.push(remRoute);

    // Sort routes by recommendation score
    return routes.sort((a, b) => {
      const scoreA = this.calculateRouteScore(a, options);
      const scoreB = this.calculateRouteScore(b, options);
      return scoreB - scoreA;
    });
  }

  /**
   * Plan direct route (walking or biking)
   */
  private static async planDirectRoute(
    origin: Coordinates,
    destination: Station,
    weather?: WeatherData
  ): Promise<MultiModalRoute | null> {
    try {
      const distance = this.calculateDistance(origin, destination.location);

      // Walking route
      const walkingTime = (distance / 80) * 60; // ~80m/min walking speed
      let adjustedWalkTime = walkingTime;
      let weatherAdjusted = false;

      if (weather) {
        const adjusted = WeatherService.adjustTravelTime(walkingTime, 'walking', weather);
        adjustedWalkTime = adjusted.adjustedTime;
        weatherAdjusted = adjusted.adjustedTime !== walkingTime;
      }

      const walkingSegment: JourneySegment = {
        type: 'walk',
        from: 'Your location',
        to: destination.name,
        duration: adjustedWalkTime,
        distance: distance,
        instructions: `Walk to ${destination.name} station`,
      };

      const walkingRoute: MultiModalRoute = {
        segments: [walkingSegment],
        totalDuration: adjustedWalkTime,
        totalDistance: distance,
        totalCost: 0,
        weatherAdjusted,
        recommendation: 'best',
      };

      // Biking route (if distance is reasonable)
      if (distance > 500 && distance < 10000) {
        const bikingTime = (distance / 250) * 60; // ~250m/min biking speed
        let adjustedBikeTime = bikingTime;

        if (weather && !weather.condition.includes('extreme')) {
          const adjusted = WeatherService.adjustTravelTime(bikingTime, 'biking', weather);
          adjustedBikeTime = adjusted.adjustedTime;
          weatherAdjusted = adjusted.adjustedTime !== bikingTime;
        }

        const bikingSegment: JourneySegment = {
          type: 'bike',
          from: 'Your location',
          to: destination.name,
          duration: adjustedBikeTime,
          distance: distance,
          instructions: `Bike to ${destination.name} station (BIXI available)`,
        };

        return {
          segments: [bikingSegment],
          totalDuration: adjustedBikeTime,
          totalDistance: distance,
          totalCost: 0,
          weatherAdjusted,
          recommendation: bikingTime < walkingTime ? 'fastest' : 'best',
        };
      }

      return walkingRoute;
    } catch (error) {
      console.error('Error planning direct route:', error);
      return null;
    }
  }

  /**
   * Plan park-and-ride route
   */
  private static async planParkAndRide(
    origin: Coordinates,
    destination: Station,
    _options: any
  ): Promise<MultiModalRoute | null> {
    // Find nearby stations with parking
    const parkingStations = allStations.filter(
      (s) =>
        s.type === 'metro' &&
        s.facilities?.some((f) => f.type === 'parking' && f.available)
    );

    if (parkingStations.length === 0) return null;

    // Find closest parking station
    const closestParking = parkingStations.reduce((prev, curr) => {
      const prevDist = this.calculateDistance(origin, prev.location);
      const currDist = this.calculateDistance(origin, curr.location);
      return currDist < prevDist ? curr : prev;
    });

    const drivingDist = this.calculateDistance(origin, closestParking.location);
    const drivingTime = (drivingDist / 800) * 60; // ~800m/min average city driving

    const segments: JourneySegment[] = [
      {
        type: 'drive',
        from: 'Your location',
        to: closestParking.name,
        duration: drivingTime,
        distance: drivingDist,
        instructions: `Drive to ${closestParking.name} (parking available)`,
        cost: 10, // Estimated parking cost
      },
      {
        type: 'metro',
        from: closestParking.name,
        to: destination.name,
        duration: 15, // Estimated metro time
        distance: 5000, // Estimated
        instructions: `Take metro to ${destination.name}`,
        line: closestParking.type === 'metro' && closestParking.line ? 
          (Array.isArray(closestParking.line) ? closestParking.line[0] : closestParking.line) : 
          'green',
        cost: 3.75,
      },
    ];

    return {
      segments,
      totalDuration: drivingTime + 15 + 5, // +5 for parking
      totalDistance: drivingDist + 5000,
      totalCost: 13.75,
      weatherAdjusted: false,
      recommendation: 'fastest',
    };
  }

  /**
   * Plan bus + metro combination
   */
  private static async planBusMetroRoute(
    origin: Coordinates,
    destination: Station,
    _options: any
  ): Promise<MultiModalRoute | null> {
    // Find nearest bus-accessible metro station
    const nearbyMetroStations = allStations
      .filter((s) => s.type === 'metro')
      .sort((a, b) => {
        const distA = this.calculateDistance(origin, a.location);
        const distB = this.calculateDistance(origin, b.location);
        return distA - distB;
      })
      .slice(0, 3);

    if (nearbyMetroStations.length === 0) return null;

    const closestMetro = nearbyMetroStations[0];
    const walkToBusStop = 5; // minutes
    const busWaitTime = 8; // average wait time
    const busTravelTime = 15; // estimated

    const segments: JourneySegment[] = [
      {
        type: 'walk',
        from: 'Your location',
        to: 'Bus stop',
        duration: walkToBusStop,
        distance: 400,
        instructions: 'Walk to nearest STM bus stop',
      },
      {
        type: 'bus',
        from: 'Bus stop',
        to: closestMetro.name,
        duration: busWaitTime + busTravelTime,
        distance: 3000,
        instructions: `Take STM bus to ${closestMetro.name}`,
        cost: 3.75,
      },
      {
        type: 'metro',
        from: closestMetro.name,
        to: destination.name,
        duration: 12,
        distance: 4000,
        instructions: `Take metro to ${destination.name}`,
        line: closestMetro.type === 'metro' && closestMetro.line ? 
          (Array.isArray(closestMetro.line) ? closestMetro.line[0] : closestMetro.line) : 
          'green',
      },
    ];

    return {
      segments,
      totalDuration: walkToBusStop + busWaitTime + busTravelTime + 12,
      totalDistance: 7400,
      totalCost: 3.75, // One fare for both bus and metro
      weatherAdjusted: false,
      recommendation: 'cheapest',
    };
  }

  /**
   * Plan REM connection route
   */
  private static async planREMRoute(
    origin: Coordinates,
    destination: Station,
    _options: any
  ): Promise<MultiModalRoute | null> {
    // Check if destination has REM connection
    const hasREMConnection = destination.type === 'metro' && destination.connections?.some(
      (c: any) => c.type === 'rem'
    );

    if (!hasREMConnection) return null;

    const remStation = allStations.find((s) => s.type === 'rem');
    if (!remStation) return null;

    const walkingDist = this.calculateDistance(origin, remStation.location);
    const walkingTime = (walkingDist / 80) * 60;

    const segments: JourneySegment[] = [
      {
        type: 'walk',
        from: 'Your location',
        to: remStation.name,
        duration: walkingTime,
        distance: walkingDist,
        instructions: `Walk to ${remStation.name} REM station`,
      },
      {
        type: 'train',
        from: remStation.name,
        to: destination.name,
        duration: 10,
        distance: 5000,
        instructions: `Take REM to ${destination.name}`,
        line: 'REM',
        cost: 6, // REM fare
      },
    ];

    return {
      segments,
      totalDuration: walkingTime + 10 + 3, // +3 for transfer
      totalDistance: walkingDist + 5000,
      totalCost: 6,
      weatherAdjusted: false,
      recommendation: 'fastest',
    };
  }

  /**
   * Calculate haversine distance between two coordinates
   */
  private static calculateDistance(
    coord1: Coordinates,
    coord2: Coordinates
  ): number {
    const R = 6371000; // Earth radius in meters
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Calculate route score for sorting
   */
  private static calculateRouteScore(
    route: MultiModalRoute,
    options: any
  ): number {
    let score = 0;

    // Prefer shorter total duration
    score += (60 - Math.min(route.totalDuration, 60)) * 2;

    // Prefer lower cost
    score += (20 - Math.min(route.totalCost, 20)) * 1;

    // Prefer indoor routes in bad weather
    if (options.preferIndoor) {
      const indoorSegments = route.segments.filter(
        (s) => s.type === 'metro' || s.type === 'train'
      ).length;
      score += indoorSegments * 10;
    }

    // Prefer accessible routes
    if (options.requireAccessible) {
      score += 20;
    }

    // Bonus for weather-adjusted routes
    if (route.weatherAdjusted) {
      score += 5;
    }

    return score;
  }

  /**
   * Get transfer instructions between stations
   */
  static getTransferInstructions(
    fromStation: string,
    toStation: string
  ): string | null {
    const transfer = transferInfo.find(
      (t) => t.fromStation === fromStation && t.toStation === toStation
    );

    return transfer?.directions || null;
  }

  /**
   * Format route for display
   */
  static formatRoute(route: MultiModalRoute, language: 'en' | 'fr' = 'en'): string {
    const segments = route.segments.map((seg, idx) => {
      const icon = this.getSegmentIcon(seg.type);
      const time = `${seg.duration} min`;
      return `${idx + 1}. ${icon} ${seg.instructions} (${time})`;
    }).join('\n');

    const total = language === 'en'
      ? `Total: ${route.totalDuration} min, $${route.totalCost.toFixed(2)}`
      : `Total: ${route.totalDuration} min, ${route.totalCost.toFixed(2)} $`;

    return `${segments}\n\n${total}`;
  }

  /**
   * Get icon for segment type
   */
  private static getSegmentIcon(type: JourneySegment['type']): string {
    const icons = {
      walk: '🚶',
      bike: '🚴',
      metro: '🚇',
      rem: '🚊',
      train: '🚂',
      bus: '🚌',
      drive: '🚗',
    };
    return icons[type] || '→';
  }
}
