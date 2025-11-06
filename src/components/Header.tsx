import { GlobeIcon } from '@radix-ui/react-icons';
import { cn } from '../lib/utils';

interface HeaderProps {
  language: 'en' | 'fr';
  onToggleLanguage: () => void;
}

const translations = {
  en: {
    title: 'Montreal Transit Explorer',
    subtitle: 'Multi-modal journey planner with weather integration',
    langButton: 'FR',
  },
  fr: {
    title: 'Explorateur du Transport de Montréal',
    subtitle: 'Planificateur de trajets multimodal avec intégration météo',
    langButton: 'EN',
  },
};

export function Header({ language, onToggleLanguage }: HeaderProps) {
  const t = translations[language];

  return (
    <header className="glass-card border-b border-white/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-3">
              <span className="text-4xl">🚇</span>
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                {t.title}
              </span>
            </h1>
            <p className="text-slate-600 mt-2 text-sm font-medium">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={onToggleLanguage}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <GlobeIcon className="w-4 h-4" />
            <span>{t.langButton}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
