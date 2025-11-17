import type { RouteQuery } from '../types';

/**
 * Natural Language Parser for Chat Commands
 * Extracts route information and preferences from user queries
 */
export class ChatParser {
  /**
   * Parse a user query into a structured route request
   */
  static parseQuery(query: string): RouteQuery {
    const lowerQuery = query.toLowerCase();
    
    // Check for round trip
    const roundTrip = this.hasKeyword(lowerQuery, [
      'round trip', 'roundtrip', 'round-trip', 'return', 'back',
      'aller-retour', 'retour', 'retourner'
    ]);

    // Extract waypoints (via, through, stop at, etc.)
    const waypoints = this.extractWaypoints(query, lowerQuery);

    // Check for simple "A to B" pattern
    const simplePattern = /^(.+?)\s+to\s+(.+)$/i;
    const simpleMatch = query.match(simplePattern);
    
    let from: string | null = null;
    let to: string | null = null;
    
    if (simpleMatch) {
      // Simple "X to Y" format
      from = simpleMatch[1].trim();
      to = simpleMatch[2].trim();
      
      // Clean up common prefixes
      from = from.replace(/^(from|start at|starting from|at)\s+/gi, '').trim();
      to = to.replace(/^(to|going to|towards)\s+/gi, '').trim();
    } else {
      // Extract locations using keywords
      from = this.extractLocation(lowerQuery, ['from', 'starting at', 'starting from', 'start at', 'start', 'at', 'départ de', 'de']);
      to = this.extractLocation(lowerQuery, ['to', 'going to', 'ending at', 'vers', 'à', 'jusqu\'à']);
    }

    // Extract preferences
    const preferences = {
      avoidTraffic: this.hasKeyword(lowerQuery, [
        'avoid traffic', 'no traffic', 'less traffic', 'low traffic',
        'éviter trafic', 'éviter le trafic', 'sans trafic'
      ]),
      preferFlat: this.hasKeyword(lowerQuery, [
        'flat', 'flattest', 'no hills', 'easy', 'niveau', 'plat', 
        'sans côtes', 'facile'
      ]),
      preferGoodAir: this.hasKeyword(lowerQuery, [
        'air quality', 'good air', 'clean air', 'fresh air',
        'qualité air', 'air pur', 'bon air'
      ]),
    };

    return {
      query,
      from: from || undefined,
      to: to || undefined,
      waypoints: waypoints.length > 0 ? waypoints : undefined,
      roundTrip: roundTrip || undefined,
      preferences,
    };
  }

  /**
   * Extract waypoints from query (via, through, stop at, etc.)
   */
  private static extractWaypoints(query: string, _lowerQuery: string): string[] {
    const waypoints: string[] = [];
    
    // Patterns for waypoints
    const patterns = [
      /via\s+([^,\\.;]+)/gi,
      /through\s+([^,\\.;]+)/gi,
      /stop\s+at\s+([^,\\.;]+)/gi,
      /pass\s+through\s+([^,\\.;]+)/gi,
      /par\s+([^,\\.;]+)/gi,
      /en\s+passant\s+par\s+([^,\\.;]+)/gi,
    ];

    for (const pattern of patterns) {
      const matches = query.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          const waypoint = match[1].trim();
          if (waypoint.length > 2 && !this.isCommandWord(waypoint.toLowerCase())) {
            waypoints.push(waypoint);
          }
        }
      }
    }

    // Also check for comma-separated locations (e.g., "A, B, C")
    const commaPattern = /([^,]+),([^,]+),/g;
    const commaMatches = query.matchAll(commaPattern);
    for (const match of commaMatches) {
      const locations = match[0].split(',').map(l => l.trim()).filter(l => l.length > 2);
      if (locations.length > 2) {
        // First is origin, last is destination, middle ones are waypoints
        waypoints.push(...locations.slice(1, -1));
      }
    }

    return [...new Set(waypoints)]; // Remove duplicates
  }

  /**
   * Extract location after specific keywords
   */
  private static extractLocation(query: string, keywords: string[]): string | null {
    // First try keyword-based extraction
    for (const keyword of keywords) {
      const pattern = new RegExp(`${keyword}\\s+([^,\\.;]+?)(?:\\s+(?:to|vers|à|going|and|et)|$)`, 'i');
      const match = query.match(pattern);
      
      if (match && match[1]) {
        // Clean up the location string
        let location = match[1].trim();
        
        // Remove common filler words
        location = location.replace(/\b(the|le|la|les|du|de|at)\b/gi, '').trim();
        
        // Check if it's a valid location (not just a single word that might be a command)
        if (location.length > 2 && !this.isCommandWord(location)) {
          return location;
        }
      }
    }
    
    // Fallback: try to extract any location-like words
    // Common Montreal locations
    const montrealLocations = [
      'mcgill', 'old port', 'oldport', 'vieux-port', 'vieux port',
      'plateau', 'mile end', 'downtown', 'centre-ville',
      'mont-royal', 'mont royal', 'mountain', 'montagne',
      'verdun', 'ndg', 'notre-dame-de-grâce',
      'westmount', 'outremont', 'rosemont', 'hochelaga',
      'villeray', 'griffintown', 'little italy', 'petite-italie',
      'quartier latin', 'gay village', 'the village',
      'saint-henri', 'lachine', 'lasalle', 'côte-des-neiges'
    ];
    
    const lowerQuery = query.toLowerCase();
    for (const location of montrealLocations) {
      if (lowerQuery.includes(location)) {
        return location;
      }
    }
    
    return null;
  }

  /**
   * Check if query contains any of the keywords
   */
  private static hasKeyword(query: string, keywords: string[]): boolean {
    return keywords.some(keyword => query.includes(keyword.toLowerCase()));
  }

  /**
   * Check if a word is likely a command word rather than a location
   */
  private static isCommandWord(word: string): boolean {
    const commandWords = [
      'find', 'show', 'get', 'give', 'want', 'need', 'help',
      'trouver', 'montrer', 'afficher', 'donner', 'veux', 'besoin', 'aide'
    ];
    return commandWords.includes(word.toLowerCase());
  }

  /**
   * Generate a friendly response acknowledging the request
   */
  static generateAcknowledgment(parsed: RouteQuery, language: 'en' | 'fr'): string {
    const { from, to, preferences } = parsed;
    
    let response = '';
    
    if (language === 'en') {
      if (from && to) {
        response = `I'll find you a bike route from ${from} to ${to}`;
      } else if (to) {
        response = `I'll find you a bike route to ${to}`;
      } else if (from) {
        response = `I'll find you a bike route starting from ${from}`;
      } else {
        response = `I'll help you plan a bike route`;
      }

      const prefs: string[] = [];
      if (preferences?.preferFlat) prefs.push('flat terrain');
      if (preferences?.avoidTraffic) prefs.push('less traffic');
      if (preferences?.preferGoodAir) prefs.push('good air quality');

      if (prefs.length > 0) {
        response += ` with ${prefs.join(', ')}`;
      }

      response += '.';
    } else {
      // French
      if (from && to) {
        response = `Je vais trouver un itinéraire vélo de ${from} à ${to}`;
      } else if (to) {
        response = `Je vais trouver un itinéraire vélo vers ${to}`;
      } else if (from) {
        response = `Je vais trouver un itinéraire vélo depuis ${from}`;
      } else {
        response = `Je vais vous aider à planifier un itinéraire vélo`;
      }

      const prefs: string[] = [];
      if (preferences?.preferFlat) prefs.push('terrain plat');
      if (preferences?.avoidTraffic) prefs.push('moins de trafic');
      if (preferences?.preferGoodAir) prefs.push('bonne qualité d\'air');

      if (prefs.length > 0) {
        response += ` avec ${prefs.join(', ')}`;
      }

      response += '.';
    }

    return response;
  }

  /**
   * Generate route summary message
   */
  static generateRouteSummary(route: any, language: 'en' | 'fr'): string {
    const distance = (route.distance / 1000).toFixed(1);
    const duration = Math.round(route.duration / 60);
    const totalTime = route.estimatedTotalTime ? Math.round(route.estimatedTotalTime / 60) : duration;
    const elevation = Math.round(route.totalElevationGain);

    if (language === 'en') {
      let summary = `Found a great route! 🚴‍♂️\n\n`;
      summary += `📍 Distance: ${distance} km`;
      if (route.roundTrip) summary += ` (round trip)`;
      summary += `\n`;
      summary += `⏱️ Estimated time: ${duration} minutes`;
      if (route.estimatedTotalTime && route.estimatedTotalTime !== route.duration) {
        summary += ` (total: ${totalTime} min)`;
      }
      summary += `\n`;
      if (route.waypoints && route.waypoints.length > 0) {
        summary += `🛑 Waypoints: ${route.waypoints.join(', ')}\n`;
      }
      summary += `⛰️ Elevation gain: ${elevation} meters\n`;
      summary += `🚦 Traffic: ${route.trafficLevel}\n`;
      summary += `🌬️ Air quality: ${route.airQualityScore}/10\n`;
      summary += `🛡️ Safety score: ${route.safetyScore}/100`;

      if (route.warnings.length > 0) {
        summary += `\n\n⚠️ Note: This route has some warnings`;
      }

      return summary;
    } else {
      // French
      let summary = `Itinéraire trouvé! 🚴‍♂️\n\n`;
      summary += `📍 Distance: ${distance} km`;
      if (route.roundTrip) summary += ` (aller-retour)`;
      summary += `\n`;
      summary += `⏱️ Temps estimé: ${duration} minutes`;
      if (route.estimatedTotalTime && route.estimatedTotalTime !== route.duration) {
        summary += ` (total: ${totalTime} min)`;
      }
      summary += `\n`;
      if (route.waypoints && route.waypoints.length > 0) {
        summary += `🛑 Points d'arrêt: ${route.waypoints.join(', ')}\n`;
      }
      summary += `⛰️ Dénivelé: ${elevation} mètres\n`;
      summary += `🚦 Trafic: ${route.trafficLevel}\n`;
      summary += `🌬️ Qualité de l'air: ${route.airQualityScore}/10\n`;
      summary += `🛡️ Score de sécurité: ${route.safetyScore}/100`;

      if (route.warnings.length > 0) {
        summary += `\n\n⚠️ Note: Cet itinéraire comporte des avertissements`;
      }

      return summary;
    }
  }

  /**
   * Detect if query is asking for help
   */
  static isHelpQuery(query: string): boolean {
    const helpKeywords = [
      'help', 'how', 'what can', 'commands', 'usage',
      'aide', 'comment', 'que peux', 'commandes', 'utilisation'
    ];
    
    const lowerQuery = query.toLowerCase();
    return helpKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  /**
   * Generate help message
   */
  static generateHelpMessage(language: 'en' | 'fr'): string {
    if (language === 'en') {
      return `🚴‍♂️ Montreal Bike Route Assistant

I can help you plan bike routes around Montreal! Here's what I can do:

**Find Routes:**
• "Find a bike route from McGill to Old Port"
• "Route from Plateau to Mile End"

**Optimize for Preferences:**
• "Flattest route to Mont-Royal"
• "Avoid traffic from downtown to NDG"
• "Best air quality route to Verdun"

**Get Information:**
• Distance and estimated time
• Elevation profile with gains/losses
• Traffic conditions
• Air quality along the route
• Safety scores

Just tell me where you want to go, and I'll find the best bike route for you! 🗺️`;
    } else {
      return `🚴‍♂️ Assistant d'itinéraire vélo Montréal

Je peux vous aider à planifier des itinéraires vélo à Montréal! Voici ce que je peux faire:

**Trouver des itinéraires:**
• "Trouver un itinéraire vélo de McGill au Vieux-Port"
• "Itinéraire du Plateau à Mile End"

**Optimiser selon vos préférences:**
• "Itinéraire le plus plat vers Mont-Royal"
• "Éviter le trafic du centre-ville à NDG"
• "Meilleure qualité d'air vers Verdun"

**Obtenir des informations:**
• Distance et temps estimé
• Profil d'élévation avec dénivelés
• Conditions de trafic
• Qualité de l'air le long de l'itinéraire
• Scores de sécurité

Dites-moi simplement où vous voulez aller, et je trouverai le meilleur itinéraire vélo pour vous! 🗺️`;
    }
  }

  /**
   * Validate if we have enough information to create a route
   */
  static canCreateRoute(parsed: RouteQuery): { valid: boolean; message: string } {
    // Need both from and to for a route
    if (!parsed.from || !parsed.to) {
      let message = 'Please provide ';
      if (!parsed.from && !parsed.to) {
        message += 'both a starting point and destination. Try: "McGill to Old Port"';
      } else if (!parsed.from) {
        message += 'a starting point. Try: "from McGill to Old Port"';
      } else {
        message += 'a destination. Try: "McGill to Old Port"';
      }
      return {
        valid: false,
        message,
      };
    }

    return { valid: true, message: '' };
  }
}

