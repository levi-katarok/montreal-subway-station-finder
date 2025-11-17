import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getMCPClient } from './mcpClient';
import { getContext7Service } from './context7Service';
import { BikeRoutingService } from './bikeRoutingService';
import { AirQualityService } from './airQualityService';
import type { BikeRoute, ChatMessage } from '@shared/types';

/**
 * LLM Agent Service
 * Integrates OpenAI with MCP (Google Maps) and Context7 for intelligent route planning
 */
export class LLMAgent {
  private openai = createOpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
  });
  private model = this.openai('gpt-4o-mini');
  private mcpClient = getMCPClient();
  private context7 = getContext7Service();

  /**
   * Initialize the agent
   */
  async initialize(): Promise<void> {
    try {
      await this.mcpClient.connect();
    } catch (error) {
      console.warn('MCP client initialization failed, continuing without MCP:', error);
    }
  }

  /**
   * Process a chat message with streaming response
   */
  async *processMessage(
    messages: ChatMessage[],
    language: 'en' | 'fr' = 'en'
  ): AsyncGenerator<string, void, unknown> {
    try {
      // Convert messages to AI SDK format
      const aiMessages = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }));

      // Define tools available to the agent
      const tools = {
        searchPlaces: tool({
          description: language === 'en' 
            ? 'Search for places, locations, or points of interest using Google Maps. Use this to find addresses, landmarks, or businesses.'
            : 'Rechercher des lieux, emplacements ou points d\'intérêt avec Google Maps. Utilisez ceci pour trouver des adresses, monuments ou entreprises.',
          parameters: z.object({
            query: z.string().describe('The search query (e.g., "McGill University", "Old Port Montreal")'),
            location: z.string().optional().describe('Optional location context (e.g., "Montreal, QC")'),
          }),
          execute: async ({ query, location }) => {
            try {
              const result = await this.mcpClient.searchPlaces(
                query,
                location || 'Montreal, QC, Canada'
              );
              return JSON.stringify(result);
            } catch (error) {
              return `Error searching places: ${error instanceof Error ? error.message : 'Unknown error'}`;
            }
          },
        }),

        getPlaceDetails: tool({
          description: language === 'en'
            ? 'Get detailed information about a specific place using its place ID.'
            : 'Obtenir des informations détaillées sur un lieu spécifique en utilisant son ID de lieu.',
          parameters: z.object({
            placeId: z.string().describe('The Google Places API place ID'),
          }),
          execute: async ({ placeId }) => {
            try {
              const result = await this.mcpClient.getPlaceDetails(placeId);
              return JSON.stringify(result);
            } catch (error) {
              return `Error getting place details: ${error instanceof Error ? error.message : 'Unknown error'}`;
            }
          },
        }),

        calculateBikeRoute: tool({
          description: language === 'en'
            ? 'Calculate a bike route between two locations with elevation, traffic, and air quality analysis. This is the main function for route planning.'
            : 'Calculer un itinéraire vélo entre deux emplacements avec analyse d\'élévation, de trafic et de qualité de l\'air. C\'est la fonction principale pour la planification d\'itinéraires.',
          parameters: z.object({
            origin: z.string().describe('Starting location (address or place name)'),
            destination: z.string().describe('Destination location (address or place name)'),
            avoidTraffic: z.boolean().optional().describe('Prefer routes with less traffic'),
            preferFlat: z.boolean().optional().describe('Prefer flatter routes'),
            preferGoodAir: z.boolean().optional().describe('Prefer routes with better air quality'),
          }),
          execute: async ({ origin, destination, avoidTraffic, preferFlat, preferGoodAir }) => {
            try {
              BikeRoutingService.initialize();
              const route = await BikeRoutingService.calculateRoute(origin, destination, {
                avoidTraffic,
                preferFlat,
                preferGoodAir,
              });

              if (!route) {
                return JSON.stringify({ error: 'Route not found' });
              }

              // Enhance with air quality
              const startLocation = route.segments[0]?.startLocation;
              const endLocation = route.segments[route.segments.length - 1]?.endLocation;
              
              if (startLocation && endLocation) {
                try {
                  const airQuality = await AirQualityService.getRouteAirQuality(
                    startLocation,
                    endLocation
                  );
                  route.airQualityScore = AirQualityService.calculateScore(airQuality.average);
                } catch (error) {
                  console.error('Error fetching air quality:', error);
                }
              }

              return JSON.stringify({
                success: true,
                route: {
                  id: route.id,
                  origin: route.origin,
                  destination: route.destination,
                  distance: route.distance,
                  duration: route.duration,
                  totalElevationGain: route.totalElevationGain,
                  trafficLevel: route.trafficLevel,
                  airQualityScore: route.airQualityScore,
                  safetyScore: route.safetyScore,
                  warnings: route.warnings,
                },
              });
            } catch (error) {
              return JSON.stringify({ 
                error: error instanceof Error ? error.message : 'Unknown error' 
              });
            }
          },
        }),
      };

      // System prompt with Context7 integration
      const systemPrompt = language === 'en'
        ? `You are an intelligent bike route planning assistant for Montreal, Canada. 
You help users find the best bike routes using Google Maps data, MCP tools, and comprehensive analysis.

Your capabilities:
- Search for locations and places using Google Maps (via MCP)
- Calculate bike routes with elevation, traffic, and air quality analysis
- Access documentation and context via Context7 when needed
- Provide recommendations based on route characteristics
- Answer questions about cycling in Montreal

When a user asks for a route:
1. First, search for the origin and destination locations to get accurate addresses
2. Calculate the bike route with user preferences
3. Provide a friendly summary with key metrics (distance, time, elevation, traffic, air quality, safety)
4. Offer helpful recommendations

You have access to:
- Google Maps MCP tools for location search
- Context7 for enhanced documentation when needed
- Bike routing services with elevation and traffic analysis

Always be helpful, friendly, and provide detailed information. Respond in ${language === 'en' ? 'English' : 'French'}.`
        : `Vous êtes un assistant intelligent de planification d'itinéraires vélo pour Montréal, Canada.
Vous aidez les utilisateurs à trouver les meilleurs itinéraires vélo en utilisant les données Google Maps et une analyse complète.

Vos capacités:
- Rechercher des lieux et emplacements avec Google Maps
- Calculer des itinéraires vélo avec analyse d'élévation, de trafic et de qualité de l'air
- Fournir des recommandations basées sur les caractéristiques de l'itinéraire
- Répondre aux questions sur le cyclisme à Montréal

Quand un utilisateur demande un itinéraire:
1. D'abord, recherchez les lieux d'origine et de destination pour obtenir des adresses précises
2. Calculez l'itinéraire vélo avec les préférences de l'utilisateur
3. Fournissez un résumé amical avec les métriques clés (distance, temps, élévation, trafic, qualité de l'air, sécurité)
4. Offrez des recommandations utiles

Soyez toujours utile, amical et fournissez des informations détaillées. Répondez en français.`;

      // Stream the response
      const result = streamText({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...aiMessages,
        ],
        tools,
        maxSteps: 5,
      });

      // Yield chunks as they come
      for await (const chunk of result.textStream) {
        yield chunk;
      }
    } catch (error) {
      console.error('Error in LLM agent:', error);
      yield language === 'en'
        ? 'Sorry, I encountered an error. Please try again.'
        : 'Désolé, j\'ai rencontré une erreur. Veuillez réessayer.';
    }
  }

  /**
   * Process a message without streaming (for compatibility)
   */
  async processMessageSync(
    messages: ChatMessage[],
    language: 'en' | 'fr' = 'en'
  ): Promise<string> {
    let fullResponse = '';
    for await (const chunk of this.processMessage(messages, language)) {
      fullResponse += chunk;
    }
    return fullResponse;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    try {
      await this.mcpClient.disconnect();
    } catch (error) {
      console.error('Error cleaning up MCP client:', error);
    }
  }
}

// Singleton instance
let agentInstance: LLMAgent | null = null;

export function getLLMAgent(): LLMAgent {
  if (!agentInstance) {
    agentInstance = new LLMAgent();
  }
  return agentInstance;
}

