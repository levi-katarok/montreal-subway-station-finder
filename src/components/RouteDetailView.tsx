import type { BikeRoute, Language } from '../types';
import { ElevationProfile } from './ElevationProfile';
import { BikeMapComponent } from './BikeMapComponent';

interface RouteDetailViewProps {
  route: BikeRoute;
  language: Language;
  onClose: () => void;
}

export function RouteDetailView({ route, language, onClose }: RouteDetailViewProps) {
  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(0)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black pb-16">
      {/* Header */}
      <div className="sticky top-0 bg-black z-40 border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="p-2 -ml-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 font-semibold text-white">
          {language === 'en' ? 'Route Details' : 'Détails de l\'itinéraire'}
        </div>
      </div>

      {/* Map */}
      <div className="h-64 bg-black relative overflow-hidden">
        <BikeMapComponent
          route={route}
          language={language}
          showTraffic={false}
        />
      </div>

      {/* Route Info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="mb-2">
          <div className="font-semibold text-white text-lg">{route.origin}</div>
          {route.waypoints && route.waypoints.length > 0 && (
            <div className="text-sm text-white/80 mt-1">
              {language === 'en' ? 'Via' : 'Via'} {route.waypoints.join(', ')}
            </div>
          )}
          <div className="text-sm text-white/60 mt-1">
            {language === 'en' ? 'To' : 'Vers'} {route.destination}
            {route.roundTrip && (
              <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded border border-white/20">
                {language === 'en' ? 'Round Trip' : 'Aller-retour'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 py-4 grid grid-cols-3 gap-4 border-b border-white/10">
        <div className="text-center">
          <div className="text-xs text-white/60 mb-1">{language === 'en' ? 'Distance' : 'Distance'}</div>
          <div className="text-base font-semibold text-white">{formatDistance(route.distance)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/60 mb-1">
            {language === 'en' ? 'Duration' : 'Durée'}
            {route.estimatedTotalTime && route.estimatedTotalTime !== route.duration && (
              <span className="text-white ml-1">*</span>
            )}
          </div>
          <div className="text-base font-semibold text-white">{formatDuration(route.duration)}</div>
          {route.estimatedTotalTime && route.estimatedTotalTime !== route.duration && (
            <div className="text-xs text-white/60 mt-0.5">
              {language === 'en' ? 'Total' : 'Total'}: {formatDuration(route.estimatedTotalTime)}
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="text-xs text-white/60 mb-1">{language === 'en' ? 'Elevation' : 'Dénivelé'}</div>
          <div className="text-base font-semibold text-white">{Math.round(route.totalElevationGain)}m</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/60 mb-1">{language === 'en' ? 'Avg Speed' : 'Vitesse moy'}</div>
          <div className="text-base font-semibold text-white">
            {Math.round((route.distance / route.duration) * 3.6)} km/h
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/60 mb-1">{language === 'en' ? 'Traffic' : 'Trafic'}</div>
          <div className="text-base font-semibold text-white capitalize">{route.trafficLevel}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/60 mb-1">{language === 'en' ? 'Air Quality' : 'Qualité air'}</div>
          <div className="text-base font-semibold text-white">{route.airQualityScore}/10</div>
        </div>
      </div>

      {/* Elevation Profile */}
      {route.hasElevationData && (
        <div className="px-4 py-4 border-b border-white/10">
          <h3 className="text-base font-semibold text-white mb-3">
            {language === 'en' ? 'Elevation Profile' : 'Profil d\'élévation'}
          </h3>
          <ElevationProfile 
            elevationData={route.elevationProfile} 
            language={language}
            width={350}
            height={150}
          />
        </div>
      )}

      {/* Directions */}
      <div className="px-4 py-4">
        <h3 className="text-base font-semibold text-white mb-3">
          {language === 'en' ? 'Directions' : 'Itinéraire'}
        </h3>
        <div className="space-y-3">
          {route.segments.slice(0, 5).map((segment, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div 
                  className="text-sm text-white mb-1"
                  dangerouslySetInnerHTML={{ __html: segment.instructions }}
                />
                <div className="text-xs text-white/60">
                  {formatDistance(segment.distance)} • {formatDuration(segment.duration)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

