
interface HeaderProps {
  language: 'en' | 'fr';
  onToggleLanguage: () => void;
}

const translations = {
  en: {
    title: 'RouteVelo',
    subtitle: 'Smart cycling with elevation, traffic & air quality',
    langButton: 'FR',
  },
  fr: {
    title: 'RouteVelo',
    subtitle: 'Cyclisme intelligent avec élévation, trafic et qualité d\'air',
    langButton: 'EN',
  },
};

export function Header({ language, onToggleLanguage }: HeaderProps) {
  const t = translations[language];

  return (
    <header className="bg-black border-b border-white/10 sticky top-0 z-50 safe-area-inset-top">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black text-lg font-bold">🚴</span>
            </div>
            <h1 className="text-lg font-bold text-white">
              {t.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium text-sm transition-colors"
            >
              {t.langButton}
            </button>
            <button className="p-2 text-white/70 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
