import type { BikeRoute, Language } from '@shared/types';
import { ElevationProfile } from './ElevationProfile';

interface RouteDetailsPanelProps {
  route: BikeRoute;
  language: Language;
  onClose?: () => void;
}

export function RouteDetailsPanel({ route, language, onClose }: RouteDetailsPanelProps) {
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return language === 'en' 
        ? `${hours}h ${minutes}min`
        : `${hours}h ${minutes}min`;
    }
    return language === 'en' ? `${minutes} min` : `${minutes} min`;
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'light': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'heavy': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAirQualityInfo = (score: number) => {
    if (score >= 9) return { label: 'Excellent', color: 'text-green-600 bg-green-50' };
    if (score >= 7) return { label: language === 'en' ? 'Good' : 'Bon', color: 'text-green-600 bg-green-50' };
    if (score >= 5) return { label: language === 'en' ? 'Moderate' : 'Modéré', color: 'text-yellow-600 bg-yellow-50' };
    if (score >= 3) return { label: language === 'en' ? 'Poor' : 'Mauvais', color: 'text-orange-600 bg-orange-50' };
    return { label: language === 'en' ? 'Very Poor' : 'Très Mauvais', color: 'text-red-600 bg-red-50' };
  };

  const airQuality = getAirQualityInfo(route.airQualityScore);

  return (
    <div className="bg-[#1a5f3f] rounded-2xl border border-[#22c55e]/30 p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            {language === 'en' ? 'Route Details' : 'Détails de l\'itinéraire'}
          </h2>
          <div className="flex items-center gap-2 text-sm text-[#22c55e]">
            <span className="font-medium">{route.origin}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium">{route.destination}</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0a1f14] rounded-xl p-4 border border-[#22c55e]/30">
          <div className="text-sm text-[#22c55e] mb-1">
            {language === 'en' ? 'Distance' : 'Distance'}
          </div>
          <div className="text-2xl font-semibold text-white">
            {formatDistance(route.distance)}
          </div>
        </div>

        <div className="bg-[#0a1f14] rounded-xl p-4 border border-[#22c55e]/30">
          <div className="text-sm text-[#22c55e] mb-1">
            {language === 'en' ? 'Duration' : 'Durée'}
          </div>
          <div className="text-2xl font-semibold text-white">
            {formatDuration(route.duration)}
          </div>
        </div>

        <div className="bg-[#0a1f14] rounded-xl p-4 border border-[#22c55e]/30">
          <div className="text-sm text-[#22c55e] mb-1">
            {language === 'en' ? 'Elevation Gain' : 'Dénivelé'}
          </div>
          <div className="text-2xl font-semibold text-white">
            {Math.round(route.totalElevationGain)} m
          </div>
        </div>

        <div className="bg-[#0a1f14] rounded-xl p-4 border border-[#22c55e]/30">
          <div className="text-sm text-[#22c55e] mb-1">
            {language === 'en' ? 'Safety Score' : 'Score de sécurité'}
          </div>
          <div className="text-2xl font-semibold text-white">
            {route.safetyScore}/100
          </div>
        </div>
      </div>

      {/* Elevation Profile */}
      {route.hasElevationData && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            {language === 'en' ? 'Elevation Profile' : 'Profil d\'élévation'}
          </h3>
          <ElevationProfile 
            elevationData={route.elevationProfile} 
            language={language}
            width={700}
            height={200}
          />
          
          {/* Elevation Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-[#0a1f14] rounded-lg border border-[#22c55e]/30">
              <div className="text-xs text-[#22c55e] mb-1">
                {language === 'en' ? 'Min Elevation' : 'Élévation min'}
              </div>
              <div className="text-lg font-semibold text-white">
                {Math.round(route.minElevation)} m
              </div>
            </div>
            <div className="text-center p-3 bg-[#0a1f14] rounded-lg border border-[#22c55e]/30">
              <div className="text-xs text-[#22c55e] mb-1">
                {language === 'en' ? 'Max Elevation' : 'Élévation max'}
              </div>
              <div className="text-lg font-semibold text-white">
                {Math.round(route.maxElevation)} m
              </div>
            </div>
            <div className="text-center p-3 bg-[#0a1f14] rounded-lg border border-[#22c55e]/30">
              <div className="text-xs text-[#22c55e] mb-1">
                {language === 'en' ? 'Avg Grade' : 'Pente moyenne'}
              </div>
              <div className="text-lg font-semibold text-white">
                {route.averageGrade.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Traffic & Air Quality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-[#22c55e]/30 rounded-xl p-4 bg-[#0a1f14]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">
              {language === 'en' ? 'Traffic Level' : 'Niveau de trafic'}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTrafficColor(route.trafficLevel)}`}>
              {route.trafficLevel.charAt(0).toUpperCase() + route.trafficLevel.slice(1)}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {route.trafficLevel === 'light' && (language === 'en' 
              ? 'Low traffic expected on this route'
              : 'Trafic léger attendu sur cet itinéraire')}
            {route.trafficLevel === 'moderate' && (language === 'en'
              ? 'Moderate traffic expected'
              : 'Trafic modéré attendu')}
            {route.trafficLevel === 'heavy' && (language === 'en'
              ? 'Heavy traffic expected - consider alternative times'
              : 'Trafic dense attendu - considérer d\'autres horaires')}
          </p>
        </div>

        <div className="border border-[#22c55e]/30 rounded-xl p-4 bg-[#0a1f14]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">
              {language === 'en' ? 'Air Quality' : 'Qualité de l\'air'}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${airQuality.color}`}>
              {airQuality.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                style={{ width: `${route.airQualityScore * 10}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-700">
              {route.airQualityScore}/10
            </span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {route.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                {language === 'en' ? 'Route Warnings' : 'Avertissements'}
              </h3>
              <ul className="text-xs text-yellow-800 space-y-1">
                {route.warnings.map((warning, idx) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Turn-by-turn directions */}
      <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            {language === 'en' ? 'Directions' : 'Itinéraire'}
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {route.segments.map((segment, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-[#0a1f14] rounded-lg hover:bg-[#22c55e]/10 transition-colors border border-[#22c55e]/20">
                <div className="flex-shrink-0 w-6 h-6 bg-[#22c55e] text-[#0a1f14] rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div 
                    className="text-sm text-white mb-1"
                    dangerouslySetInnerHTML={{ __html: segment.instructions }}
                  />
                  <div className="flex items-center gap-4 text-xs text-[#22c55e]">
                  <span>{formatDistance(segment.distance)}</span>
                  <span>•</span>
                  <span>{formatDuration(segment.duration)}</span>
                  {segment.elevationGain !== 0 && (
                    <>
                      <span>•</span>
                      <span className={segment.elevationGain > 0 ? 'text-orange-600' : 'text-green-600'}>
                        {segment.elevationGain > 0 ? '↗' : '↘'} {Math.abs(Math.round(segment.elevationGain))}m
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

