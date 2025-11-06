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

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-8 animate-fade-in-up",
        "hover:shadow-2xl transition-all duration-300",
        recommendations.preferIndoor && "ring-2 ring-pink-300/50 ring-offset-2"
      )}
    >
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-5">
          <div className="text-6xl" role="img" aria-label="Weather icon">
            {icon}
          </div>
          <div>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              {language === 'en' ? 'Current Weather' : 'Météo actuelle'}
            </h3>
            <p className="text-4xl font-semibold text-slate-900">
              {temp}
            </p>
            <p className="text-sm text-slate-600 mt-1">{weather.description}</p>
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
