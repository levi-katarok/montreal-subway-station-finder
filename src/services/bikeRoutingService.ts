import type { BikeRoute, RouteSegment, ElevationPoint, TrafficLevel } from '../types';

/**
 * Bike Routing Service
 * Handles bike route planning with elevation, traffic, and air quality analysis
 */
export class BikeRoutingService {
  private static directionsService: google.maps.DirectionsService | null = null;
  private static elevationService: google.maps.ElevationService | null = null;

  static initialize() {
    if (window.google?.maps) {
      this.directionsService = new google.maps.DirectionsService();
      this.elevationService = new google.maps.ElevationService();
      console.log('✅ Bike Routing Service initialized');
    }
  }

  /**
   * Calculate bike route with multiple optimization options
   */
  static async calculateRoute(
    origin: string | google.maps.LatLng,
    destination: string | google.maps.LatLng,
    options: {
      avoidTraffic?: boolean;
      preferFlat?: boolean;
      preferGoodAir?: boolean;
      waypoints?: Array<{ location: string | google.maps.LatLng }>;
      roundTrip?: boolean;
    } = {}
  ): Promise<BikeRoute | null> {
    if (!this.directionsService || !this.elevationService) {
      this.initialize();
    }

    if (!this.directionsService || !this.elevationService) {
      throw new Error('Google Maps services not initialized');
    }

    try {
      // Request bike directions
      const directionsRequest: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.BICYCLING,
        waypoints: options.waypoints,
        optimizeWaypoints: options.waypoints && options.waypoints.length > 0,
        provideRouteAlternatives: true,
      };

      const directionsResult = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        this.directionsService!.route(directionsRequest, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });

      // Process all alternative routes
      const routes: BikeRoute[] = [];
      
      for (const route of directionsResult.routes) {
        const processedRoute = await this.processRoute(route, options, origin, destination);
        if (processedRoute) {
          routes.push(processedRoute);
        }
      }

      // Sort routes based on preferences
      const sortedRoutes = this.sortRoutes(routes, options);
      let finalRoute = sortedRoutes[0] || null;

      // Handle round trip - calculate return route
      if (finalRoute && options.roundTrip) {
        const returnRoute = await this.calculateReturnRoute(destination, origin, options);
        if (returnRoute) {
          // Combine routes
          finalRoute = this.combineRoutes(finalRoute, returnRoute);
        }
      }

      return finalRoute;
    } catch (error) {
      console.error('Error calculating bike route:', error);
      return null;
    }
  }

  /**
   * Calculate return route for round trip
   */
  private static async calculateReturnRoute(
    origin: string | google.maps.LatLng,
    destination: string | google.maps.LatLng,
    options: any
  ): Promise<BikeRoute | null> {
    const directionsRequest: google.maps.DirectionsRequest = {
      origin,
      destination,
      travelMode: google.maps.TravelMode.BICYCLING,
      provideRouteAlternatives: false,
    };

    try {
      const directionsResult = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        this.directionsService!.route(directionsRequest, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            resolve(result);
          } else {
            reject(new Error(`Return route failed: ${status}`));
          }
        });
      });

      if (directionsResult.routes.length > 0) {
        return await this.processRoute(directionsResult.routes[0], options, origin, destination);
      }
      return null;
    } catch (error) {
      console.error('Error calculating return route:', error);
      return null;
    }
  }

  /**
   * Combine two routes (outbound and return)
   */
  private static combineRoutes(outbound: BikeRoute, returnRoute: BikeRoute): BikeRoute {
    // Combine polylines (simplified - in production would properly merge)
    const combinedPolyline = outbound.polyline;
    
    // Combine bounds
    const combinedBounds = new google.maps.LatLngBounds();
    combinedBounds.union(outbound.bounds);
    combinedBounds.union(returnRoute.bounds);

    // Combine elevation profiles
    const returnElevationOffset = outbound.distance;
    const combinedElevationProfile = [
      ...outbound.elevationProfile,
      ...returnRoute.elevationProfile.map(point => ({
        ...point,
        distance: point.distance + returnElevationOffset,
      })),
    ];

    // Combine segments
    const combinedSegments = [
      ...outbound.segments,
      ...returnRoute.segments,
    ];

    return {
      ...outbound,
      distance: outbound.distance + returnRoute.distance,
      duration: outbound.duration + returnRoute.duration,
      estimatedTotalTime: outbound.duration + returnRoute.duration,
      totalElevationGain: outbound.totalElevationGain + returnRoute.totalElevationGain,
      totalElevationLoss: outbound.totalElevationLoss + returnRoute.totalElevationLoss,
      maxElevation: Math.max(outbound.maxElevation, returnRoute.maxElevation),
      minElevation: Math.min(outbound.minElevation, returnRoute.minElevation),
      elevationProfile: combinedElevationProfile,
      segments: combinedSegments,
      polyline: combinedPolyline,
      bounds: combinedBounds,
      roundTrip: true,
    };
  }

  /**
   * Process a single route with elevation and traffic data
   */
  private static async processRoute(
    route: google.maps.DirectionsRoute,
    _options: any,
    _origin: string | google.maps.LatLng,
    _destination: string | google.maps.LatLng
  ): Promise<BikeRoute | null> {
    try {
      const leg = route.legs[0];
      const path = route.overview_path;

      // Get elevation data for the route
      const elevationData = await this.getElevationData(path);
      
      // Calculate elevation statistics
      const elevationStats = this.calculateElevationStats(elevationData);
      
      // Analyze traffic (simplified - you'd need real-time traffic data)
      const trafficLevel = this.estimateTrafficLevel();
      
      // Get air quality estimate (simplified)
      const airQualityScore = await this.estimateAirQuality(path);

      // Calculate safety score based on bike lanes and traffic
      const safetyScore = this.calculateSafetyScore(route);

      // Process segments
      const segments: RouteSegment[] = leg.steps.map((step, index) => ({
        distance: step.distance!.value,
        duration: step.duration!.value,
        instructions: step.instructions,
        startLocation: {
          lat: step.start_location.lat(),
          lng: step.start_location.lng(),
        },
        endLocation: {
          lat: step.end_location.lat(),
          lng: step.end_location.lng(),
        },
        elevationGain: this.getSegmentElevationGain(elevationData, index, leg.steps.length),
        trafficLevel: trafficLevel,
      }));

      const bikeRoute: BikeRoute = {
        id: route.summary || `route-${Date.now()}`,
        origin: leg.start_address,
        destination: leg.end_address,
        distance: leg.distance!.value,
        duration: leg.duration!.value,
        elevationProfile: elevationData,
        totalElevationGain: elevationStats.gain,
        totalElevationLoss: elevationStats.loss,
        maxElevation: elevationStats.max,
        minElevation: elevationStats.min,
        averageGrade: elevationStats.averageGrade,
        trafficLevel: trafficLevel,
        airQualityScore: airQualityScore,
        safetyScore: safetyScore,
        segments: segments,
        polyline: route.overview_polyline,
        bounds: route.bounds,
        warnings: route.warnings || [],
        hasElevationData: elevationData.length > 0,
      };

      return bikeRoute;
    } catch (error) {
      console.error('Error processing route:', error);
      return null;
    }
  }

  /**
   * Get elevation data for a path
   */
  private static async getElevationData(path: google.maps.LatLng[]): Promise<ElevationPoint[]> {
    if (!this.elevationService || path.length === 0) return [];

    try {
      // Sample points along the path (max 512 points for Google API)
      const sampleSize = Math.min(path.length, 256);
      const sampledPath = this.samplePath(path, sampleSize);

      const result = await new Promise<google.maps.ElevationResult[]>((resolve, reject) => {
        this.elevationService!.getElevationAlongPath(
          {
            path: sampledPath,
            samples: sampleSize,
          },
          (results, status) => {
            if (status === google.maps.ElevationStatus.OK && results) {
              resolve(results);
            } else {
              reject(new Error(`Elevation request failed: ${status}`));
            }
          }
        );
      });

      return result.map((point, index) => ({
        location: {
          lat: point.location!.lat(),
          lng: point.location!.lng(),
        },
        elevation: point.elevation!,
        distance: this.calculatePathDistance(sampledPath.slice(0, index + 1)),
      }));
    } catch (error) {
      console.error('Error fetching elevation data:', error);
      return [];
    }
  }

  /**
   * Sample points evenly along a path
   */
  private static samplePath(path: google.maps.LatLng[], numSamples: number): google.maps.LatLng[] {
    if (path.length <= numSamples) return path;

    const sampled: google.maps.LatLng[] = [];
    const interval = (path.length - 1) / (numSamples - 1);

    for (let i = 0; i < numSamples; i++) {
      const index = Math.round(i * interval);
      sampled.push(path[index]);
    }

    return sampled;
  }

  /**
   * Calculate total distance along a path
   */
  private static calculatePathDistance(path: google.maps.LatLng[]): number {
    let distance = 0;
    for (let i = 1; i < path.length; i++) {
      distance += google.maps.geometry.spherical.computeDistanceBetween(path[i - 1], path[i]);
    }
    return distance;
  }

  /**
   * Calculate elevation statistics
   */
  private static calculateElevationStats(elevationData: ElevationPoint[]): {
    gain: number;
    loss: number;
    max: number;
    min: number;
    averageGrade: number;
  } {
    if (elevationData.length === 0) {
      return { gain: 0, loss: 0, max: 0, min: 0, averageGrade: 0 };
    }

    let gain = 0;
    let loss = 0;
    let max = elevationData[0].elevation;
    let min = elevationData[0].elevation;

    for (let i = 1; i < elevationData.length; i++) {
      const elevChange = elevationData[i].elevation - elevationData[i - 1].elevation;

      if (elevChange > 0) {
        gain += elevChange;
      } else {
        loss += Math.abs(elevChange);
      }

      max = Math.max(max, elevationData[i].elevation);
      min = Math.min(min, elevationData[i].elevation);
    }

    const totalDistance = elevationData[elevationData.length - 1].distance;
    const totalElevChange = elevationData[elevationData.length - 1].elevation - elevationData[0].elevation;
    const averageGrade = totalDistance > 0 ? (totalElevChange / totalDistance) * 100 : 0;

    return { gain, loss, max, min, averageGrade };
  }

  /**
   * Get elevation gain for a specific segment
   */
  private static getSegmentElevationGain(
    elevationData: ElevationPoint[],
    segmentIndex: number,
    totalSegments: number
  ): number {
    const pointsPerSegment = Math.floor(elevationData.length / totalSegments);
    const startIdx = segmentIndex * pointsPerSegment;
    const endIdx = Math.min(startIdx + pointsPerSegment, elevationData.length - 1);

    if (startIdx >= elevationData.length || endIdx >= elevationData.length) return 0;

    const startElev = elevationData[startIdx].elevation;
    const endElev = elevationData[endIdx].elevation;

    return endElev - startElev;
  }

  /**
   * Estimate traffic level (simplified - would need real traffic API)
   */
  private static estimateTrafficLevel(): TrafficLevel {
    const hour = new Date().getHours();
    
    // Rush hour estimation
    if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
      return 'heavy';
    } else if ((hour >= 6 && hour <= 10) || (hour >= 15 && hour <= 19)) {
      return 'moderate';
    } else {
      return 'light';
    }
  }

  /**
   * Estimate air quality along route
   */
  private static async estimateAirQuality(_path: google.maps.LatLng[]): Promise<number> {
    // Simplified estimation - in production, would query air quality API
    // Consider factors: distance from highways, parks, industrial areas
    
    // For now, return a score from 1-10 (10 being best)
    // Could integrate with OpenWeatherMap Air Pollution API or similar
    return 7; // Default moderate air quality
  }

  /**
   * Calculate safety score based on route characteristics
   */
  private static calculateSafetyScore(route: google.maps.DirectionsRoute): number {
    // Calculate safety based on real Google Maps data:
    // - Road types (residential > secondary > primary > highway)
    // - Traffic conditions (if available)
    // - Time of day
    // - Route warnings

    let score = 100;
    const leg = route.legs[0];
    const steps = leg.steps;

    // 1. Analyze road types from step instructions and maneuvers
    let residentialCount = 0;
    let highwayCount = 0;
    let totalSteps = steps.length;

    steps.forEach(step => {
      const instructions = step.instructions.toLowerCase();

      // Check for highway/freeway (very unsafe for bikes)
      if (instructions.includes('highway') ||
          instructions.includes('freeway') ||
          instructions.includes('expressway') ||
          instructions.includes('autoroute')) {
        highwayCount++;
        score -= 15; // Heavy penalty for highways
      }

      // Bonus for residential/local streets
      if (instructions.includes('residential') ||
          instructions.includes('local') ||
          instructions.includes('rue') || // French for street
          instructions.includes('avenue') ||
          instructions.includes('bike') ||
          instructions.includes('vélo') ||
          instructions.includes('cyclable')) {
        residentialCount++;
        score += 2;
      }

      // Penalty for major roads
      if (instructions.includes('boulevard') ||
          instructions.includes('main') ||
          instructions.includes('major')) {
        score -= 3;
      }
    });

    // 2. Penalize for route warnings
    if (route.warnings && route.warnings.length > 0) {
      route.warnings.forEach(warning => {
        const lowerWarning = warning.toLowerCase();
        if (lowerWarning.includes('caution') || lowerWarning.includes('pedestrian')) {
          score -= 5;
        }
        if (lowerWarning.includes('toll') || lowerWarning.includes('ferry')) {
          score -= 3;
        }
      });
    }

    // 3. Time of day factor (safer during daytime)
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour <= 9) {
      // Morning rush hour - moderate traffic
      score -= 5;
    } else if (currentHour >= 16 && currentHour <= 19) {
      // Evening rush hour - heavy traffic
      score -= 10;
    } else if (currentHour >= 21 || currentHour <= 5) {
      // Night time - visibility concerns
      score -= 8;
    } else {
      // Daytime, non-rush hour - safest
      score += 5;
    }

    // 4. Traffic density estimation from number of turns
    // More turns typically means quieter residential areas
    const turnsPerKm = (totalSteps / (leg.distance!.value / 1000));
    if (turnsPerKm > 8) {
      score += 5; // Lots of turns = residential/quiet
    } else if (turnsPerKm < 2) {
      score -= 5; // Few turns = major roads
    }

    // 5. Route complexity (too many turns can be confusing/unsafe)
    if (totalSteps > 30) {
      score -= 3; // Overly complex route
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Sort routes based on user preferences
   */
  private static sortRoutes(routes: BikeRoute[], options: any): BikeRoute[] {
    return routes.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Prefer flatter routes
      if (options.preferFlat) {
        scoreA -= a.totalElevationGain;
        scoreB -= b.totalElevationGain;
      }

      // Prefer good air quality
      if (options.preferGoodAir) {
        scoreA += a.airQualityScore * 10;
        scoreB += b.airQualityScore * 10;
      }

      // Avoid traffic
      if (options.avoidTraffic) {
        const trafficPenalty = { light: 0, moderate: -50, heavy: -100 };
        scoreA += trafficPenalty[a.trafficLevel];
        scoreB += trafficPenalty[b.trafficLevel];
      }

      // Safety score
      scoreA += a.safetyScore;
      scoreB += b.safetyScore;

      // Shorter is generally better
      scoreA -= a.distance / 100;
      scoreB -= b.distance / 100;

      return scoreB - scoreA;
    });
  }
}

