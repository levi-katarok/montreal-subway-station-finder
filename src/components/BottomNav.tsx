import type { Language } from '../types';

interface BottomNavProps {
  activeTab: 'home' | 'map' | 'add';
  onTabChange: (tab: 'home' | 'map' | 'add') => void;
  language: Language;
}

export function BottomNav({ activeTab, onTabChange, language }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: language === 'en' ? 'Routes' : 'Itinéraires' },
    { id: 'map' as const, icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', label: language === 'en' ? 'Map' : 'Carte' },
    { id: 'add' as const, icon: 'M12 4v16m8-8H4', label: language === 'en' ? 'Plan' : 'Planifier' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-white' : 'text-white/40'
              }`}
            >
              <svg
                className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/40'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isActive ? 2.5 : 2}
                  d={tab.icon}
                />
              </svg>
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold text-white' : 'font-normal text-white/40'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

