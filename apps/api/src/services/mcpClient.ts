/**
 * MCP Client for Google Maps
 * Note: MCP client runs server-side only (stdio transport doesn't work in browser)
 * This is a placeholder that will be implemented on the server side
 */
export class GoogleMapsMCPClient {
  private isConnected = false;

  /**
   * Initialize connection to Google Maps MCP server
   * This should only be called server-side
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      console.warn('MCP client cannot run in browser. Use API endpoints instead.');
      return;
    }

    try {
      // Server-side implementation will be in server/api.ts
      // For now, we'll use direct Google Places API calls as fallback
      this.isConnected = true;
      console.log('MCP client initialized (server-side only)');
    } catch (error) {
      console.error('Failed to initialize MCP client:', error);
      throw error;
    }
  }

  /**
   * Search for places using Google Maps
   * Falls back to direct API calls if MCP is not available
   */
  async searchPlaces(query: string, location?: string): Promise<any> {
    console.log('🔍 MCP Client: searchPlaces()');

    // In browser, this will call the API endpoint
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/mcp/search-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, location }),
      });
      if (!response.ok) throw new Error('Failed to search places');
      return await response.json();
    }

    // Server-side: Use direct Google Places API
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    const searchQuery = location ? `${query} ${location}` : `${query} Montreal, QC`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${googleMapsApiKey}`;

    console.log(`   Searching: "${searchQuery}"`);
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    console.log(`   Found ${data.results?.length || 0} results`);
    return data;
  }

  /**
   * Get place details
   */
  async getPlaceDetails(placeId: string): Promise<any> {
    console.log('📍 MCP Client: getPlaceDetails()');

    if (typeof window !== 'undefined') {
      const response = await fetch('/api/mcp/place-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      });
      if (!response.ok) throw new Error('Failed to get place details');
      return await response.json();
    }

    // Server-side: Use direct Google Places API
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googleMapsApiKey}`;

    console.log(`   Getting details for place: ${placeId}`);
    const response = await fetch(detailsUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    console.log(`   Retrieved details for: ${data.result?.name || 'Unknown'}`);
    return data;
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect(): Promise<void> {
    this.isConnected = false;
  }
}

// Singleton instance
let mcpClientInstance: GoogleMapsMCPClient | null = null;

export function getMCPClient(): GoogleMapsMCPClient {
  if (!mcpClientInstance) {
    mcpClientInstance = new GoogleMapsMCPClient();
  }
  return mcpClientInstance;
}

