import { useState } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { RouteFeed } from './components/RouteFeed';
import { RouteDetailView } from './components/RouteDetailView';
import { BottomNav } from './components/BottomNav';
import { BikeMapComponent } from './components/BikeMapComponent';
import { RouteOrchestrator } from './services/routeOrchestrator';
import type { ChatMessage, BikeRoute } from '@shared/types';

type Tab = 'home' | 'map' | 'add';

function App() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [routes, setRoutes] = useState<BikeRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<BikeRoute | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showChat, setShowChat] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const handleRouteRequest = async (query: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);

    try {
      // Process the route query
      const result = await RouteOrchestrator.processRouteQuery(
        query,
        language
      );

      // Add assistant messages
      setMessages(prev => [...prev, ...result.messages]);

      // Add route to feed
      if (result.route) {
        setRoutes(prev => [result.route!, ...prev]);
        setShowChat(false);
      }

    } catch (error) {
      console.error('Error processing route:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: language === 'en'
          ? 'Sorry, I encountered an error. Please try again.'
          : 'Désolé, j\'ai rencontré une erreur. Veuillez réessayer.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteClick = (route: BikeRoute) => {
    setSelectedRoute(route);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'add') {
      setShowChat(true);
      setSelectedRoute(null);
    } else {
      setShowChat(false);
      setSelectedRoute(null);
    }
  };

  // Show route detail view
  if (selectedRoute) {
    return (
      <div className="min-h-screen bg-white">
        <RouteDetailView
          route={selectedRoute}
          language={language}
          onClose={() => setSelectedRoute(null)}
        />
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          language={language}
        />
      </div>
    );
  }

  // Show chat interface
  if (showChat) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            onRouteRequest={handleRouteRequest}
            messages={messages}
            setMessages={setMessages}
            isLoading={isLoading}
            language={language}
          />
        </div>
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          language={language}
        />
      </div>
    );
  }

  // Show map view
  if (activeTab === 'map') {
    return (
      <div className="h-screen bg-black flex flex-col overflow-hidden">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <div className="flex-1 relative w-full overflow-hidden min-h-0">
          <BikeMapComponent
            route={routes.length > 0 ? routes[0] : null}
            language={language}
            showTraffic={true}
            hideControls={false}
          />
        </div>
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          language={language}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <Header
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      <main className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-4">
        {/* Route Feed */}
        <RouteFeed
          routes={routes}
          language={language}
          onRouteClick={handleRouteClick}
        />
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        language={language}
      />
    </div>
  );
}

export default App;
