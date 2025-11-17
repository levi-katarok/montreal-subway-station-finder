import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@shared/types';
import { getLLMApiClient } from '../services/llmApiClient';

interface ChatInterfaceProps {
  onRouteRequest?: (query: string, from?: string, to?: string) => Promise<void>;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  isLoading?: boolean;
  language: 'en' | 'fr';
}

export function ChatInterface({ onRouteRequest, messages, setMessages, isLoading: externalIsLoading, language }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const apiClient = getLLMApiClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || externalIsLoading) return;

    const query = input.trim();
    setInput('');
    setSelectedSuggestion(null);
    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Create assistant message for streaming
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, assistantMessage]);
    setStreamingMessageId(assistantMessageId);

    try {
      // Stream response from LLM agent
      let fullContent = '';
      for await (const chunk of apiClient.streamChat([...messages, userMessage], language)) {
        fullContent += chunk;
        // Update the streaming message
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: fullContent }
            : msg
        ));
      }

      // Check if route was mentioned and call onRouteRequest if provided
      if (onRouteRequest && (fullContent.toLowerCase().includes('route') || fullContent.toLowerCase().includes('itinéraire'))) {
        const parsed = parseRouteQuery(query);
        try {
          await onRouteRequest(query, parsed.from, parsed.to);
        } catch (error) {
          console.error('Error in onRouteRequest:', error);
        }
      }
    } catch (error) {
      console.error('Error streaming chat:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: language === 'en'
          ? 'Sorry, I encountered an error. Please try again.'
          : 'Désolé, j\'ai rencontré une erreur. Veuillez réessayer.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev.filter(msg => msg.id !== assistantMessageId), errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
    }
  };

  const parseRouteQuery = (query: string) => {
    // Simple parsing logic - can be enhanced with NLP
    const fromMatch = query.match(/from\s+([^to]+?)(?:\s+to|$)/i);
    const toMatch = query.match(/to\s+(.+?)$/i);
    
    return {
      from: fromMatch?.[1]?.trim(),
      to: toMatch?.[1]?.trim(),
    };
  };

  const suggestions = language === 'en' 
    ? [
        'McGill to Old Port',
        'Plateau to Mile End',
        'Downtown to Mont-Royal (flat)',
        'Westmount to Verdun (avoid traffic)',
      ]
    : [
        'McGill au Vieux-Port',
        'Plateau à Mile End',
        'Centre-ville à Mont-Royal (plat)',
        'Westmount à Verdun (éviter trafic)',
      ];

  return (
    <div className="bg-black flex flex-col h-full max-h-screen">
      {/* Chat Header */}
      <div className="bg-black border-b border-white/10 px-4 py-3 flex-shrink-0">
        <h2 className="text-lg font-bold text-white">
          {language === 'en' ? 'Plan Your Route' : 'Planifiez votre itinéraire'}
        </h2>
        <p className="text-sm text-white/60 mt-1">
          {language === 'en' 
            ? 'Describe where you want to cycle'
            : 'Décrivez où vous voulez faire du vélo'}
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 space-y-4 bg-black min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-8 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 border border-white/20">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'en' ? 'Ready to plan your route?' : 'Prêt à planifier votre itinéraire?'}
            </h3>
            <p className="text-white/60 mb-6 text-sm">
              {language === 'en' 
                ? 'Type your route below or try one of these examples'
                : 'Tapez votre itinéraire ci-dessous ou essayez un de ces exemples'}
            </p>
            
            {/* Quick suggestions */}
            <div className="space-y-2 max-w-sm mx-auto">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(suggestion);
                    setSelectedSuggestion(idx);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    selectedSuggestion === idx
                      ? 'bg-white text-black border-2 border-white shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-white text-black ml-auto'
                  : 'bg-white/10 border border-white/20 text-white'
              }`}
            >
              {message.role === 'assistant' && message.icon && (
                <div className="mb-2">{message.icon}</div>
              )}

              {/* Show spinning wheel if this is the streaming message and content is empty */}
              {message.role === 'assistant' && message.id === streamingMessageId && message.content === '' ? (
                <div className="flex items-center gap-3 py-2">
                  <svg
                    className="w-6 h-6 animate-spin text-white"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ animationDuration: '1s' }}
                  >
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none" />
                    <line x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="2" />
                    <line x1="50" y1="50" x2="88.3" y2="25" stroke="currentColor" strokeWidth="2" />
                    <line x1="50" y1="50" x2="88.3" y2="75" stroke="currentColor" strokeWidth="2" />
                    <line x1="50" y1="50" x2="50" y2="95" stroke="currentColor" strokeWidth="2" />
                    <line x1="50" y1="50" x2="11.7" y2="75" stroke="currentColor" strokeWidth="2" />
                    <line x1="50" y1="50" x2="11.7" y2="25" stroke="currentColor" strokeWidth="2" />
                    <circle cx="50" cy="50" r="8" fill="currentColor" />
                  </svg>
                  <span className="text-sm text-white/60">
                    {language === 'en' ? 'Thinking...' : 'Réflexion...'}
                  </span>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}

              {message.metadata && (
                <div className="mt-2 pt-2 border-t border-white/20 text-xs opacity-80">
                  {Object.entries(message.metadata).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {(isLoading || externalIsLoading) && !streamingMessageId && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Spinning Bike Wheel */}
                <svg
                  className="w-8 h-8 animate-spin text-white"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ animationDuration: '1s' }}
                >
                  {/* Outer rim */}
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none" />

                  {/* Spokes */}
                  <line x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="50" x2="88.3" y2="25" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="50" x2="88.3" y2="75" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="50" x2="50" y2="95" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="50" x2="11.7" y2="75" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="50" x2="11.7" y2="25" stroke="currentColor" strokeWidth="2" />

                  {/* Hub */}
                  <circle cx="50" cy="50" r="8" fill="currentColor" />
                </svg>
                <span className="text-sm text-white/80">
                  {language === 'en' ? 'Planning your route...' : 'Planification de votre itinéraire...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-40" />
      </div>

      {/* Input Area - Fixed above bottom nav */}
      <form onSubmit={handleSubmit} className="fixed bottom-16 left-0 right-0 p-4 border-t border-white/10 bg-black z-40 safe-area-inset-bottom">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'en' 
              ? 'Type route... e.g., "McGill to Old Port"'
              : 'Tapez itinéraire... ex: "McGill au Vieux-Port"'
            }
            className="flex-1 px-4 py-3 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-white bg-white/10 text-white placeholder:text-white/40"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-white hover:bg-white/90 text-black rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

