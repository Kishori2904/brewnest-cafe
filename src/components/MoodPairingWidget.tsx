import React, { useState } from 'react';
import { Laptop, BookOpen, Sparkles, Zap, Plus, Check, ArrowRight, Heart } from 'lucide-react';
import { MOOD_PAIRINGS, MENU_ITEMS } from '../data/cafeData';
import { MenuItem } from '../types';

interface MoodPairingWidgetProps {
  onAddBothToTray: (drink: MenuItem, food: MenuItem) => void;
  onSelectItemForModal?: (item: MenuItem) => void;
  trayItemIds?: string[];
}

export const MoodPairingWidget: React.FC<MoodPairingWidgetProps> = ({
  onAddBothToTray,
  onSelectItemForModal,
  trayItemIds = [],
}) => {
  const [activeMoodId, setActiveMoodId] = useState(MOOD_PAIRINGS[0].id);

  const activePairing = MOOD_PAIRINGS.find((p) => p.id === activeMoodId) || MOOD_PAIRINGS[0];

  const drinkItem = MENU_ITEMS.find((item) => item.id === activePairing.drinkId);
  const foodItem = MENU_ITEMS.find((item) => item.id === activePairing.foodId);

  const getMoodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const comboTotal = (drinkItem?.price || 0) + (foodItem?.price || 0);
  const bothInTray =
    drinkItem && foodItem
      ? trayItemIds.includes(drinkItem.id) && trayItemIds.includes(foodItem.id)
      : false;

  return (
    <div className="bg-white dark:bg-[#190F09] rounded-3xl border border-amber-200/90 dark:border-amber-900/40 p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 dark:border-amber-950/50 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-semibold border border-amber-300/60 dark:border-amber-700/50 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Recommendation Engine</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#29170E] dark:text-[#F7EAE1]">
            Find Your Perfect Brew &amp; Bite
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Tell us your mood today, and our barista-curated pairings will match your palate.
          </p>
        </div>

        <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/50 self-start md:self-auto flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Barista-Crafted Pairings</span>
        </span>
      </div>

      {/* Mood Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {MOOD_PAIRINGS.map((pairing) => {
          const isActive = pairing.id === activeMoodId;
          return (
            <button
              key={pairing.id}
              onClick={() => setActiveMoodId(pairing.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-[#331C12] dark:bg-amber-500 text-white dark:text-stone-950 border-[#331C12] dark:border-amber-400 shadow-sm ring-2 ring-amber-300/40'
                  : 'bg-stone-50/80 dark:bg-[#20140D] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-950/50 hover:bg-stone-100 dark:hover:bg-[#2A1B12]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`p-2 rounded-xl ${
                    isActive
                      ? 'bg-amber-400 dark:bg-stone-950 text-stone-950 dark:text-amber-300'
                      : 'bg-white dark:bg-[#160D08] text-stone-700 dark:text-stone-300 shadow-2xs'
                  }`}
                >
                  {getMoodIcon(pairing.iconName)}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 dark:bg-stone-950 animate-pulse" />
                )}
              </div>
              <div>
                <strong className="block text-xs font-bold leading-tight">
                  {pairing.moodName}
                </strong>
                <span
                  className={`text-[10px] line-clamp-1 mt-0.5 ${
                    isActive ? 'text-amber-200 dark:text-stone-800' : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {pairing.tagline}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Pairing Showcase Box */}
      <div className="bg-[#FAF7F2] dark:bg-[#140C07] rounded-2xl border border-stone-200 dark:border-amber-950/50 p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-200 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wide border border-transparent dark:border-amber-500/30">
              {activePairing.comboBadge}
            </span>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-1 italic">
              "{activePairing.story}"
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block">Combined Pairing:</span>
            <span className="font-serif text-2xl font-bold text-stone-900 dark:text-amber-400">
              ₹{comboTotal}
            </span>
          </div>
        </div>

        {/* 2 Items in Pairing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Drink Item */}
          {drinkItem && (
            <div className="bg-white dark:bg-[#1C120B] rounded-xl border border-stone-200 dark:border-amber-900/40 p-4 flex items-center justify-between gap-3 shadow-2xs group">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-stone-900 overflow-hidden shrink-0">
                  <img
                    src={drinkItem.image}
                    alt={drinkItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    Beverage Craft
                  </span>
                  <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-[#F7EAE1]">
                    {drinkItem.name}
                  </h4>
                  <span className="text-xs font-semibold text-stone-600 dark:text-amber-300">
                    ₹{drinkItem.price} · {drinkItem.preparationTime}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectItemForModal?.(drinkItem)}
                className="text-stone-400 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 p-2 cursor-pointer text-xs font-semibold"
                title="View item details"
              >
                Inspect
              </button>
            </div>
          )}

          {/* Food Item */}
          {foodItem && (
            <div className="bg-white dark:bg-[#1C120B] rounded-xl border border-stone-200 dark:border-amber-900/40 p-4 flex items-center justify-between gap-3 shadow-2xs group">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-stone-900 overflow-hidden shrink-0">
                  <img
                    src={foodItem.image}
                    alt={foodItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                    Culinary Pairing
                  </span>
                  <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-[#F7EAE1]">
                    {foodItem.name}
                  </h4>
                  <span className="text-xs font-semibold text-stone-600 dark:text-amber-300">
                    ₹{foodItem.price} · {foodItem.preparationTime}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectItemForModal?.(foodItem)}
                className="text-stone-400 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 p-2 cursor-pointer text-xs font-semibold"
                title="View item details"
              >
                Inspect
              </button>
            </div>
          )}
        </div>

        {/* Pairing Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200/80 dark:border-amber-950/50">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Clicking will add both items directly into your inquiry tray for review.
          </span>

          <button
            onClick={() => {
              if (drinkItem && foodItem) {
                onAddBothToTray(drinkItem, foodItem);
              }
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              bothInTray
                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60'
                : 'bg-[#331C12] hover:bg-[#201109] dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-stone-950 shadow-xs'
            }`}
          >
            {bothInTray ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Pairing Added to Tray!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-amber-300 dark:text-stone-950" />
                <span>Add Pairing to Inquiry Tray (₹{comboTotal})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

};
