import type { BikeRoute, Language } from '@shared/types';
import { BikeMapComponent } from './BikeMapComponent';

interface RouteFeedProps {
  routes: BikeRoute[];
  language: Language;
  onRouteClick: (route: BikeRoute) => void;
}

export function RouteFeed({ routes, language, onRouteClick }: RouteFeedProps) {
  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(0)} km`;
  };

  if (routes.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-block p-4 bg-white/10 rounded-full mb-4 border border-white/20">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {language === 'en' ? 'No routes yet' : 'Aucun itinéraire'}
        </h3>
        <p className="text-white/60 text-sm">
          {language === 'en' 
            ? 'Plan your first route to get started!'
            : 'Planifiez votre premier itinéraire pour commencer!'}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full py-4 space-y-4 pb-20">
      {routes.map((route, idx) => (
        <div
          key={route.id || idx}
          onClick={() => onRouteClick(route)}
          className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/15 transition-all flex flex-col h-[calc(100vh-9rem)]"
        >
          {/* Header */}
          <div className="p-4 flex items-center gap-3 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">{route.origin}</div>
              <div className="text-xs text-white/60">
                {language === 'en' ? 'To' : 'Vers'} {route.destination}
              </div>
            </div>
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          {/* Map Preview */}
          <div className="flex-1 bg-black relative overflow-hidden min-h-0">
            <BikeMapComponent
              route={route}
              language={language}
              showTraffic={false}
              hideControls={true}
            />
            {/* Route Statistics Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl border border-white/20 p-2.5 z-10">
              <div className="flex items-center gap-2 text-xs flex-nowrap">
                <div className="whitespace-nowrap">
                  <span className="text-white/60">{language === 'en' ? 'Distance:' : 'Distance:'}</span>
                  <span className="font-semibold text-white ml-0.5">{formatDistance(route.distance)}</span>
                </div>
                <div className="h-3 w-px bg-white/20 flex-shrink-0"></div>
                <div className="whitespace-nowrap">
                  <span className="text-white/60">{language === 'en' ? 'Time:' : 'Temps:'}</span>
                  <span className="font-semibold text-white ml-0.5">
                    {route.duration ? `${Math.round(route.duration / 60)} ${language === 'en' ? 'min' : 'min'}` : 'N/A'}
                  </span>
                </div>
                {route.totalElevationGain > 0 && (
                  <>
                    <div className="h-3 w-px bg-white/20 flex-shrink-0"></div>
                    <div className="whitespace-nowrap">
                      <span className="text-white/60">↗</span>
                      <span className="font-semibold text-white ml-0.5">{Math.round(route.totalElevationGain)} m</span>
                    </div>
                  </>
                )}
                {route.trafficLevel && (
                  <>
                    <div className="h-3 w-px bg-white/20 flex-shrink-0"></div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        route.trafficLevel === 'light' ? 'bg-green-500' :
                        route.trafficLevel === 'moderate' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-xs text-white/80 capitalize">
                        {language === 'en' 
                          ? route.trafficLevel === 'light' ? 'light traffic' :
                            route.trafficLevel === 'moderate' ? 'moderate traffic' : 'heavy traffic'
                          : route.trafficLevel === 'light' ? 'trafic léger' :
                            route.trafficLevel === 'moderate' ? 'trafic modéré' : 'trafic intense'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

