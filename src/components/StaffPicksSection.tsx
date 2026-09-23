import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Quote,
  Coffee,
  Check,
  Plus,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Award,
  Layers,
  Info,
} from 'lucide-react';
import { STAFF_PICKS, MENU_ITEMS } from '../data/cafeData';
import { MenuItem, StaffPick } from '../types';

interface StaffPicksSectionProps {
  onAddToTray: (item: MenuItem) => void;
  onSelectItemForModal: (item: MenuItem) => void;
  onAddBothToTray?: (drink: MenuItem, food: MenuItem) => void;
  trayItemIds: string[];
  compact?: boolean;
}

export const StaffPicksSection: React.FC<StaffPicksSectionProps> = ({
  onAddToTray,
  onSelectItemForModal,
  onAddBothToTray,
  trayItemIds,
  compact = false,
}) => {
  // Determine real-world today's day of the week (0 = Sunday, 1 = Monday, ...)
  const todayDayOfWeek = useMemo(() => new Date().getDay(), []);

  // Selected day index in STAFF_PICKS
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(todayDayOfWeek);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // Active pick
  const activePick = useMemo(() => {
    return STAFF_PICKS.find((p) => p.dayOfWeek === selectedDayOfWeek) || STAFF_PICKS[0];
  }, [selectedDayOfWeek]);

  // Associated menu item
  const activeMenuItem = useMemo(() => {
    return MENU_ITEMS.find((m) => m.id === activePick.menuItemId) || MENU_ITEMS[0];
  }, [activePick.menuItemId]);

  // Associated pairing item
  const pairingMenuItem = useMemo(() => {
    if (!activePick.pairingItemId) return null;
    return MENU_ITEMS.find((m) => m.id === activePick.pairingItemId) || null;
  }, [activePick.pairingItemId]);

  // Auto rotation timer when user toggles auto-rotate
  useEffect(() => {
    if (!isAutoRotating) return;
    const timer = setInterval(() => {
      setSelectedDayOfWeek((prev) => (prev + 1) % 7);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoRotating]);

  const isToday = selectedDayOfWeek === todayDayOfWeek;
  const isItemInTray = trayItemIds.includes(activeMenuItem.id);
  const isPairingInTray = pairingMenuItem ? trayItemIds.includes(pairingMenuItem.id) : false;

  const handlePrevDay = () => {
    setSelectedDayOfWeek((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const handleNextDay = () => {
    setSelectedDayOfWeek((prev) => (prev === 6 ? 0 : prev + 1));
  };

  return (
    <section id="staff-picks" className="relative scroll-mt-20">
      <div className="bg-white dark:bg-[#190F09] rounded-3xl border border-stone-200/90 dark:border-amber-950/60 shadow-sm overflow-hidden transition-colors duration-300">
        {/* Header Ribbon & Controls */}
        <div className="px-5 sm:px-8 py-5 border-b border-stone-200/70 dark:border-amber-950/50 bg-[#FAF7F2] dark:bg-[#140C07] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-800/50 flex items-center justify-center text-amber-900 dark:text-amber-300 shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5 text-[#8C5D3B] dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C5D3B] dark:text-amber-400">
                  Daily Barista Recommendations
                </span>
                {isToday ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                    Today's Pick
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-[#251710] text-stone-600 dark:text-stone-400">
                    Rotating Schedule
                  </span>
                )}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                Staff Picks of the Day
              </h3>
            </div>
          </div>

          {/* Quick Day Switchers / Pagination */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <div className="inline-flex items-center p-1 rounded-xl bg-stone-200/70 dark:bg-[#20140C] border border-stone-300/60 dark:border-amber-950/50">
              <button
                onClick={handlePrevDay}
                className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#2C190F] transition-all cursor-pointer"
                title="Previous Day's Pick"
                aria-label="Previous day's staff pick"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextDay}
                className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#2C190F] transition-all cursor-pointer"
                title="Next Day's Pick"
                aria-label="Next day's staff pick"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isAutoRotating
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-white dark:bg-[#20140C] text-stone-600 dark:text-stone-300 border-stone-300/60 dark:border-amber-950/50 hover:bg-stone-50 dark:hover:bg-[#2C190F]'
              }`}
              title="Automatically rotate recommendations"
            >
              {isAutoRotating ? 'Rotating ↺' : 'Auto-Rotate'}
            </button>
          </div>
        </div>

        {/* 7 Days of the Week Navigation Bar */}
        <div className="px-4 sm:px-8 py-2.5 bg-[#F5EFE6]/60 dark:bg-[#160D08] border-b border-stone-200/60 dark:border-amber-950/40 flex items-center justify-start sm:justify-center overflow-x-auto gap-1.5 no-scrollbar">
          {STAFF_PICKS.map((pick) => {
            const isSelected = pick.dayOfWeek === selectedDayOfWeek;
            const isCurrentRealDay = pick.dayOfWeek === todayDayOfWeek;

            return (
              <button
                key={pick.id}
                onClick={() => {
                  setSelectedDayOfWeek(pick.dayOfWeek);
                  setIsAutoRotating(false);
                }}
                className={`relative px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-xs'
                    : 'bg-white/80 dark:bg-[#20140C] text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-[#2C190F] border border-stone-200/60 dark:border-amber-950/30'
                }`}
              >
                <span>{pick.dayName.slice(0, 3)}</span>
                {isCurrentRealDay && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-amber-300 dark:bg-stone-900' : 'bg-emerald-600 dark:bg-emerald-400'
                    }`}
                    title="Today"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body: Two-Column Bento Layout */}
        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column (5 Cols): Item Visual & Quick Order Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div
              onClick={() => onSelectItemForModal(activeMenuItem)}
              className="group relative rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-amber-950/40 cursor-pointer aspect-[4/3] sm:aspect-[16/11]"
            >
              <img
                src={activeMenuItem.image}
                alt={activeMenuItem.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  if (activeMenuItem.vectorAsset && e.currentTarget.src !== activeMenuItem.vectorAsset) {
                    e.currentTarget.src = activeMenuItem.vectorAsset;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Day Theme Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FAF7F2]/95 dark:bg-[#1A0E08]/95 text-stone-900 dark:text-amber-300 backdrop-blur-xs border border-stone-300 dark:border-amber-950/60 shadow-2xs">
                  {activePick.dayName} · {activePick.theme}
                </span>
              </div>

              {/* Dietary / Category pill */}
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs border border-white/20">
                  {activeMenuItem.category}
                </span>
              </div>

              {/* Bottom Overlay Info */}
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                <div className="flex items-baseline justify-between">
                  <h4 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-xs">
                    {activeMenuItem.name}
                  </h4>
                  <div className="text-base sm:text-lg font-bold text-amber-300 font-mono">
                    ₹{activeMenuItem.price}
                  </div>
                </div>
                <p className="text-xs text-stone-200 line-clamp-1 drop-shadow-xs">
                  {activeMenuItem.description}
                </p>
              </div>
            </div>

            {/* Quick Specs & Direct Order Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activeMenuItem.preparationTime && (
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#20140C] border border-stone-200/60 dark:border-amber-950/40 flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <Clock className="w-3.5 h-3.5 text-[#8C5D3B] dark:text-amber-400 shrink-0" />
                    <span>Prep: {activeMenuItem.preparationTime}</span>
                  </div>
                )}
                {activeMenuItem.calories && (
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#20140C] border border-stone-200/60 dark:border-amber-950/40 flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>{activeMenuItem.calories}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onAddToTray(activeMenuItem)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isItemInTray
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-[#2B1810] hover:bg-[#1E110A] dark:bg-amber-500 dark:hover:bg-amber-600 text-amber-100 dark:text-stone-950'
                  }`}
                >
                  {isItemInTray ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Tray (₹{activeMenuItem.price})</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Pick to Tray (₹{activeMenuItem.price})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectItemForModal(activeMenuItem)}
                  className="px-3.5 py-3 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-[#20140C] hover:bg-stone-200 dark:hover:bg-[#2B1910] border border-stone-200/80 dark:border-amber-950/50 transition-colors cursor-pointer"
                  title="View full details & customization"
                >
                  Details
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Barista Profile, Tasting Notes & Personal Story */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            {/* Barista Profile Header */}
            <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#20140C] border border-stone-200/70 dark:border-amber-950/40">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={activePick.baristaAvatar}
                    alt={activePick.baristaName}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-amber-400/80 dark:ring-amber-500/60 shadow-xs"
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2B1810] dark:bg-amber-400 text-amber-300 dark:text-stone-950 flex items-center justify-center shadow-xs"
                    title="Verified BrewNest Staff"
                  >
                    <Award className="w-3 h-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-[#F7EAE1]">
                      {activePick.baristaName}
                    </h4>
                    <span className="text-[10px] font-bold text-[#8C5D3B] dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                      Staff Pick
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                    {activePick.baristaRole}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-500">
                    Hand-crafted recipe for {activePick.dayName}
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="inline-block text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  Day {selectedDayOfWeek + 1} of 7
                </span>
              </div>
            </div>

            {/* Barista Personal Note in Quotes */}
            <div className="relative p-5 rounded-2xl bg-amber-50/60 dark:bg-[#1E110A] border border-amber-200/80 dark:border-amber-900/40 space-y-2">
              <Quote className="w-6 h-6 text-amber-700/30 dark:text-amber-400/20 absolute top-3 right-3 pointer-events-none" />
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C5D3B] dark:text-amber-400 flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Barista's Personal Tasting Note</span>
              </div>
              <p className="font-serif italic text-stone-800 dark:text-amber-100/90 text-sm sm:text-base leading-relaxed">
                "{activePick.personalNote}"
              </p>
            </div>

            {/* Flavor Notes & Brewing Secret */}
            <div className="space-y-3">
              {/* Flavor Profile Pills */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 shrink-0">
                  Key Flavors:
                </span>
                {activePick.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 dark:bg-[#251710] text-stone-700 dark:text-amber-200/90 border border-stone-200/80 dark:border-amber-950/40"
                  >
                    ✦ {note}
                  </span>
                ))}
              </div>

              {/* Barista Secret Tip */}
              {activePick.brewingSecret && (
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#20140C] border border-stone-200/60 dark:border-amber-950/40 flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-300">
                  <Coffee className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-800 dark:text-stone-200 font-semibold">
                      Barista's Craft Secret:{' '}
                    </strong>
                    <span>{activePick.brewingSecret}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Pairing Banner */}
            {pairingMenuItem && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#140C07] border border-stone-200/80 dark:border-amber-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300/60 dark:border-amber-950/40">
                    <img
                      src={pairingMenuItem.image}
                      alt={pairingMenuItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                      Recommended Pairing
                    </span>
                    <strong className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      {pairingMenuItem.name} (₹{pairingMenuItem.price})
                    </strong>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                      {activePick.pairingReason}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onAddBothToTray ? (
                    <button
                      onClick={() => onAddBothToTray(activeMenuItem, pairingMenuItem)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#2B1810] dark:text-stone-950 bg-amber-200 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 transition-colors cursor-pointer shadow-2xs"
                    >
                      Add Both (₹{activeMenuItem.price + pairingMenuItem.price})
                    </button>
                  ) : (
                    <button
                      onClick={() => onAddToTray(pairingMenuItem)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-[#20140C] hover:bg-stone-200 dark:hover:bg-[#2C190F] border border-stone-300/60 dark:border-amber-950/40 transition-colors cursor-pointer"
                    >
                      {isPairingInTray ? 'Pairing Added' : `+ Add Pairing (₹${pairingMenuItem.price})`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
