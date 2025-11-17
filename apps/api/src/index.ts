import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { getLLMAgent } from './services/llmAgent.js';
import type { ChatMessage } from '../../packages/shared/src/types/index.js';

// Load .env from monorepo root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MCP Client for Google Maps (server-side only)
let mcpClient: Client | null = null;
let mcpTransport: StdioClientTransport | null = null;

async function initializeMCP() {
  try {
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!googleMapsApiKey) {
      console.warn('Google Maps API key not found. MCP features will be limited.');
      return;
    }

    mcpTransport = new StdioClientTransport({
      command: 'uvx',
      args: ['google-maps-mcp'],
      env: {
        ...process.env,
        GOOGLE_MAPS_API_KEY: googleMapsApiKey,
      },
    });

    mcpClient = new Client(
      {
        name: 'montreal-bike-route-assistant',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    await mcpClient.connect(mcpTransport);
    console.log('✅ Connected to Google Maps MCP server');
  } catch (error) {
    console.warn('⚠️  Failed to connect to MCP server. Using fallback methods:', error);
    mcpClient = null;
  }
}

// Initialize MCP on server start
initializeMCP().catch(console.error);

// Get LLM agent instance (lazy initialization)
const agent = getLLMAgent();

/**
 * POST /api/chat
 * Stream chat responses from LLM agent
 */
app.post('/api/chat', async (req, res) => {
  const requestId = `req-${Date.now()}`;
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📨 [${requestId}] Incoming chat request`);

  try {
    const { messages, language } = req.body as {
      messages: ChatMessage[];
      language?: 'en' | 'fr';
    };

    console.log(`📊 [${requestId}] Request details:`);
    console.log(`   - Language: ${language || 'en'}`);
    console.log(`   - Messages count: ${messages?.length || 0}`);
    console.log(`   - Last message: "${messages?.[messages.length - 1]?.content?.substring(0, 100)}..."`);

    if (!messages || !Array.isArray(messages)) {
      console.log(`❌ [${requestId}] Bad request: Messages array is required`);
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Set up SSE (Server-Sent Events) for streaming
    console.log(`🔄 [${requestId}] Setting up SSE stream`);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      console.log(`🤖 [${requestId}] Starting LLM agent processing...`);
      let chunkCount = 0;
      let totalChars = 0;

      // Stream the response
      for await (const chunk of agent.processMessage(messages, language || 'en')) {
        chunkCount++;
        totalChars += chunk.length;

        if (chunkCount === 1) {
          console.log(`✨ [${requestId}] First chunk received (${chunk.length} chars)`);
        }

        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);

        // Log every 10 chunks
        if (chunkCount % 10 === 0) {
          console.log(`📤 [${requestId}] Streamed ${chunkCount} chunks (${totalChars} total chars)`);
        }
      }

      console.log(`✅ [${requestId}] Stream completed successfully`);
      console.log(`   - Total chunks: ${chunkCount}`);
      console.log(`   - Total characters: ${totalChars}`);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error(`❌ [${requestId}] Error streaming response:`, error);
      console.error(`   - Error type: ${error instanceof Error ? error.constructor.name : typeof error}`);
      console.error(`   - Error message: ${error instanceof Error ? error.message : 'Unknown'}`);

      res.write(`data: ${JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      })}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error(`❌ [${requestId}] Error in /api/chat:`, error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  } finally {
    console.log(`${'='.repeat(80)}\n`);
  }
});

/**
 * POST /api/mcp/search-places
 * Search for places using Google Maps MCP
 */
app.post('/api/mcp/search-places', async (req, res) => {
  try {
    const { query, location } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (mcpClient) {
      try {
        // List available tools
        const tools = await mcpClient.listTools();
        const searchTool = tools.tools?.find((tool: any) => 
          tool.name?.toLowerCase().includes('search') || 
          tool.name?.toLowerCase().includes('place') ||
          tool.name?.toLowerCase().includes('find')
        );

        if (searchTool) {
          const result = await mcpClient.callTool({
            name: searchTool.name,
            arguments: { query, location: location || 'Montreal, QC, Canada' },
          });
          return res.json(result.content);
        }
      } catch (error) {
        console.error('MCP search error:', error);
      }
    }

    // Fallback: Use Google Places API directly
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + (location ? ` ${location}` : ' Montreal, QC'))}&key=${googleMapsApiKey}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('Error searching places:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

/**
 * POST /api/mcp/place-details
 * Get place details using Google Maps MCP
 */
app.post('/api/mcp/place-details', async (req, res) => {
  try {
    const { placeId } = req.body;

    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    if (mcpClient) {
      try {
        const tools = await mcpClient.listTools();
        const detailsTool = tools.tools?.find((tool: any) => 
          tool.name?.toLowerCase().includes('detail') || 
          tool.name?.toLowerCase().includes('place')
        );

        if (detailsTool) {
          const result = await mcpClient.callTool({
            name: detailsTool.name,
            arguments: { place_id: placeId },
          });
          return res.json(result.content);
        }
      } catch (error) {
        console.error('MCP place details error:', error);
      }
    }

    // Fallback: Use Google Places API directly
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      return res.status(500).json({ error: 'Google Maps API key not configured' });
    }

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googleMapsApiKey}`;
    const response = await fetch(detailsUrl);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('Error getting place details:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mcpConnected: mcpClient !== null,
  });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

export default app;

