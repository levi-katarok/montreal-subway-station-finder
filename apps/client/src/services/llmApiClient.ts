import type { ChatMessage } from '@shared/types';

/**
 * Client for calling the LLM API
 */
export class LLMApiClient {
  private apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  /**
   * Stream chat messages from the LLM agent
   */
  async *streamChat(
    messages: ChatMessage[],
    language: 'en' | 'fr' = 'en'
  ): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages, language }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                yield data.content;
              }
              if (data.done) {
                return;
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (error) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming chat:', error);
      throw error;
    }
  }

  /**
   * Get full chat response (non-streaming)
   */
  async getChatResponse(
    messages: ChatMessage[],
    language: 'en' | 'fr' = 'en'
  ): Promise<string> {
    let fullResponse = '';
    for await (const chunk of this.streamChat(messages, language)) {
      fullResponse += chunk;
    }
    return fullResponse;
  }
}

// Singleton instance
let apiClientInstance: LLMApiClient | null = null;

export function getLLMApiClient(): LLMApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new LLMApiClient();
  }
  return apiClientInstance;
}

