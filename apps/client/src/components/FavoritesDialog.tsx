import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, StarFilledIcon, TrashIcon } from '@radix-ui/react-icons';
import { cn } from '../lib/utils';

interface FavoritesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'en' | 'fr';
}

const translations = {
  en: {
    title: 'My Favorite Locations',
    noFavorites: 'No favorite locations saved yet',
    noFavoritesDesc: 'Search for a location and click the star to save it!',
    remove: 'Remove',
    getDirections: 'Get Directions',
  },
  fr: {
    title: 'Mes emplacements favoris',
    noFavorites: 'Aucun emplacement favori enregistré',
    noFavoritesDesc: 'Recherchez un emplacement et cliquez sur l\'étoile pour l\'enregistrer!',
    remove: 'Supprimer',
    getDirections: 'Obtenir l\'itinéraire',
  },
};

export function FavoritesDialog({ open, onOpenChange, language }: FavoritesDialogProps) {
  const t = translations[language];
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      loadFavorites();
    }
  }, [open]);

  const loadFavorites = () => {
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(stored);
  };

  const removeFavorite = (index: number) => {
    const updated = favorites.filter((_, i) => i !== index);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50",
            "translate-x-[-50%] translate-y-[-50%]",
            "w-[95vw] max-w-2xl max-h-[85vh]",
            "bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl",
            "border border-white/20",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "overflow-hidden flex flex-col"
          )}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-slate-900 flex items-center gap-2.5">
              <StarFilledIcon className="w-5 h-5 text-orange-500" />
              <span>{t.title}</span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-2 hover:bg-slate-50"
                aria-label="Close"
              >
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {favorites.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-slate-100 rounded-full">
                  <StarFilledIcon className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-base font-semibold text-slate-900 mb-1">
                  {t.noFavorites}
                </p>
                <p className="text-sm text-slate-600">
                  {t.noFavoritesDesc}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {favorites.map((favorite, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg bg-white/60 backdrop-blur-sm",
                      "border border-white/40",
                      "hover:bg-white/80 hover:border-white/60 hover:shadow-md",
                      "transition-all duration-150 group"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900 mb-0.5">
                          {favorite.name || favorite.address}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {favorite.address}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Get directions functionality will be added
                            console.log('Get directions to:', favorite);
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-md",
                            "bg-slate-900 text-white",
                            "hover:bg-slate-800",
                            "transition-colors duration-150",
                            "text-sm font-medium",
                            "opacity-0 group-hover:opacity-100"
                          )}
                        >
                          {t.getDirections}
                        </button>
                        <button
                          onClick={() => removeFavorite(index)}
                          className={cn(
                            "p-2 rounded-md",
                            "bg-red-50 text-red-700",
                            "hover:bg-red-100",
                            "transition-colors duration-150"
                          )}
                          aria-label={t.remove}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
