import { WeatherService } from '../services/weatherService';
import type { WeatherData } from '../types';
import { cn } from '../lib/utils';

interface WeatherWidgetProps {
  weather: WeatherData;
  language: 'en' | 'fr';
}

export function WeatherWidget({ weather, language }: WeatherWidgetProps) {
  const recommendations = WeatherService.getWeatherRecommendations(weather);
  const icon = WeatherService.getWeatherIcon(weather.condition);
  const temp = WeatherService.formatTemperature(weather.temperature);

  const getAirQualityColor = (index?: number) => {
    if (!index) return 'bg-gray-100 text-gray-700 border-gray-200';
    if (index === 1) return 'bg-green-100 text-green-800 border-green-200';
    if (index === 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (index === 3) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (index >= 4) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div
      className={cn(
        "bg-[#1a5f3f] rounded-2xl border border-[#22c55e]/30 p-6 shadow-xl",
        recommendations.preferIndoor && "ring-2 ring-[#22c55e]"
      )}
    >
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-5">
          <div className="text-6xl" role="img" aria-label="Weather icon">
            {icon}
          </div>
          <div>
            <h3 className="text-xs font-medium text-[#22c55e] uppercase tracking-wider mb-1">
              {language === 'en' ? 'Current Weather' : 'Météo actuelle'}
            </h3>
            <p className="text-4xl font-semibold text-white">
              {temp}
            </p>
            <p className="text-sm text-[#22c55e] mt-1">{weather.description}</p>

            {/* Air Quality Badge */}
            {weather.airQuality && weather.airQualityLabel && (
              <div className="mt-2">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border",
                  getAirQualityColor(weather.airQuality)
                )}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                  {language === 'en' ? 'Air Quality: ' : 'Qualité de l\'air: '}
                  {weather.airQualityLabel}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-pink-50/80 backdrop-blur-sm rounded-lg border border-pink-200/50">
            <span className="text-xl">💡</span>
            <p className="text-sm text-pink-900 font-medium max-w-xs">
              {recommendations.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
