import { useState, useEffect } from 'react';
import * as Switch from '@radix-ui/react-switch';
import * as Toggle from '@radix-ui/react-toggle';
import { MagnifyingGlassIcon, StarFilledIcon } from '@radix-ui/react-icons';
import { cn } from '../lib/utils';
import { useGoogleAutocomplete } from '../hooks/useGoogleAutocomplete';

interface SearchSectionProps {
  language: 'en' | 'fr';
  accessibleOnly: boolean;
  preferIndoor: boolean;
  includeDriving: boolean;
  activeLines: string[];
  onAccessibleChange: (value: boolean) => void;
  onIndoorChange: (value: boolean) => void;
  onDrivingChange: (value: boolean) => void;
  onToggleLine: (line: string) => void;
  onShowFavorites: () => void;
  onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
}

const translations = {
  en: {
    placeholder: 'Enter your location or address...',
    accessibleLabel: 'Accessible Only',
    indoorLabel: 'Prefer Indoor',
    drivingLabel: 'Include Driving',
    favoritesLabel: 'Favorites',
    toggleLinesLabel: 'Toggle Metro Lines:',
  },
  fr: {
    placeholder: 'Entrez votre emplacement ou adresse...',
    accessibleLabel: 'Accessible seulement',
    indoorLabel: 'Préférer intérieur',
    drivingLabel: 'Inclure conduite',
    favoritesLabel: 'Favoris',
    toggleLinesLabel: 'Basculer les lignes de métro:',
  },
};

const lineConfigs = [
  { id: 'green', label: 'Green', labelFr: 'Verte', color: 'bg-green-600', hoverColor: 'hover:bg-green-700' },
  { id: 'orange', label: 'Orange', labelFr: 'Orange', color: 'bg-orange-600', hoverColor: 'hover:bg-orange-700' },
  { id: 'blue', label: 'Blue', labelFr: 'Bleue', color: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
  { id: 'yellow', label: 'Yellow', labelFr: 'Jaune', color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
];

export function SearchSection({
  language,
  accessibleOnly,
  preferIndoor,
  includeDriving,
  activeLines,
  onAccessibleChange,
  onIndoorChange,
  onDrivingChange,
  onToggleLine,
  onShowFavorites,
  onPlaceSelected,
}: SearchSectionProps) {
  const t = translations[language];
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Initialize Google Autocomplete
  const inputRef = useGoogleAutocomplete({
    onPlaceSelected: (place) => {
      console.log('Place selected:', place);
      if (onPlaceSelected) {
        onPlaceSelected(place);
      }
    },
  });

  // Load favorites count from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoritesCount(favorites.length);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-8 gradient-glow animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative group">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            id="autocomplete"
            className={cn(
              "w-full pl-12 pr-4 py-3",
              "border border-pink-200/50 rounded-lg",
              "text-base placeholder:text-slate-400",
              "focus:border-pink-400 focus:ring-2 focus:ring-pink-200/50 focus:outline-none",
              "transition-all duration-150",
              "bg-white/90 backdrop-blur-sm",
              "hover:bg-white hover:border-pink-300"
            )}
            placeholder={t.placeholder}
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Accessibility Filter */}
          <label className={cn(
            "flex items-center gap-2.5 px-3.5 py-2",
            "bg-white/60 backdrop-blur-sm rounded-lg",
            "border border-white/40",
            "cursor-pointer transition-all duration-150",
            "hover:bg-white/80 hover:border-white/60",
            accessibleOnly && "bg-pink-50/80 border-pink-300/50 ring-2 ring-pink-200/50"
          )}>
            <Switch.Root
              checked={accessibleOnly}
              onCheckedChange={onAccessibleChange}
              className={cn(
                "w-11 h-6 rounded-full transition-colors",
                "data-[state=checked]:bg-slate-900 data-[state=unchecked]:bg-slate-300",
                "relative"
              )}
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5 translate-y-0.5" />
            </Switch.Root>
            <span className="text-sm font-medium text-slate-700">♿ {t.accessibleLabel}</span>
          </label>

          {/* Indoor Preference */}
          <label className={cn(
            "flex items-center gap-2.5 px-3.5 py-2",
            "bg-white/60 backdrop-blur-sm rounded-lg",
            "border border-white/40",
            "cursor-pointer transition-all duration-150",
            "hover:bg-white/80 hover:border-white/60",
            preferIndoor && "bg-pink-50/80 border-pink-300/50 ring-2 ring-pink-200/50"
          )}>
            <Switch.Root
              checked={preferIndoor}
              onCheckedChange={onIndoorChange}
              className={cn(
                "w-11 h-6 rounded-full transition-colors",
                "data-[state=checked]:bg-slate-900 data-[state=unchecked]:bg-slate-300",
                "relative"
              )}
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5 translate-y-0.5" />
            </Switch.Root>
            <span className="text-sm font-medium text-slate-700">🏢 {t.indoorLabel}</span>
          </label>

          {/* Driving Option */}
          <label className={cn(
            "flex items-center gap-2.5 px-3.5 py-2",
            "bg-white/60 backdrop-blur-sm rounded-lg",
            "border border-white/40",
            "cursor-pointer transition-all duration-150",
            "hover:bg-white/80 hover:border-white/60",
            includeDriving && "bg-pink-50/80 border-pink-300/50 ring-2 ring-pink-200/50"
          )}>
            <Switch.Root
              checked={includeDriving}
              onCheckedChange={onDrivingChange}
              className={cn(
                "w-11 h-6 rounded-full transition-colors",
                "data-[state=checked]:bg-slate-900 data-[state=unchecked]:bg-slate-300",
                "relative"
              )}
            >
              <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5 translate-y-0.5" />
            </Switch.Root>
            <span className="text-sm font-medium text-slate-700">🚗 {t.drivingLabel}</span>
          </label>

          {/* Favorites Button */}
          <button
            onClick={onShowFavorites}
            className={cn(
              "flex items-center gap-2 px-4 py-2 ml-auto",
              "bg-orange-100/80 hover:bg-orange-200/80 backdrop-blur-sm",
              "text-orange-900 border border-orange-300/50 rounded-lg font-medium text-sm",
              "transition-all duration-150 shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            )}
          >
            <StarFilledIcon className="w-4 h-4 text-orange-600" />
            <span>{t.favoritesLabel}</span>
            {favoritesCount > 0 && (
              <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

        {/* Metro Line Toggles */}
        <div className="border-t border-slate-200 pt-6">
          <p className="text-sm font-medium text-slate-700 mb-3">
            {t.toggleLinesLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {lineConfigs.map((line) => (
              <Toggle.Root
                key={line.id}
                pressed={activeLines.includes(line.id)}
                onPressedChange={() => onToggleLine(line.id)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-sm text-white",
                  "transition-all duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  "data-[state=off]:opacity-40 data-[state=off]:saturate-50",
                  line.color,
                  line.hoverColor,
                  line.id === 'yellow' && 'text-yellow-900'
                )}
                aria-label={`Toggle ${line.label} line`}
              >
                {language === 'en' ? line.label : line.labelFr}
              </Toggle.Root>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
