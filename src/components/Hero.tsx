import React, { useMemo } from 'react';
import { Coffee, Calendar, Sparkles, Quote, Plus, Check, ArrowRight, MapPin, Flame } from 'lucide-react';
import { BUSINESS_INFO, STAFF_PICKS, MENU_ITEMS } from '../data/cafeData';
import { MenuItem } from '../types';

interface HeroProps {
  onExploreMenu: () => void;
  onBookTable: () => void;
  onAddToTray?: (item: MenuItem) => void;
  onSelectItemForModal?: (item: MenuItem) => void;
  trayItemIds?: string[];
  onScrollToStaffPicks?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onBookTable,
  onAddToTray,
  onSelectItemForModal,
  trayItemIds = [],
  onScrollToStaffPicks,
}) => {
  // Today's rotating recommendation based on current day of week
  const todayPick = useMemo(() => {
    const day = new Date().getDay();
    return STAFF_PICKS.find((p) => p.dayOfWeek === day) || STAFF_PICKS[0];
  }, []);

  const todayItem = useMemo(() => {
    return MENU_ITEMS.find((m) => m.id === todayPick.menuItemId) || MENU_ITEMS[0];
  }, [todayPick.menuItemId]);

  const isTodayItemInTray = trayItemIds.includes(todayItem.id);

  return (
    <section className="relative overflow-hidden min-h-[540px] lg:min-h-[620px] flex items-center bg-[#1A0E08]">
      {/* High-Resolution Ambient Coffee & Café Table Background matching screenshot */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80"
          alt="BrewNest Café ambient coffee table with latte art and delicious cake"
          className="w-full h-full object-cover object-center opacity-70"
          loading="eager"
        />
        {/* Dark warm gradient overlay for high contrast & legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/55" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Message & Primary Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow Tagline matching screenshot */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/30 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{BUSINESS_INFO.tagline}</span>
            </div>

            {/* Main Headline matching screenshot */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              Welcome to<br />BrewNest Café
            </h1>

            {/* Subtitle matching screenshot */}
            <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed font-normal max-w-xl">
              A cozy place where great food, aromatic coffee and good vibes come together. Enjoy fresh brews, delicious treats and a warm atmosphere — always.
            </p>

            {/* Two Primary CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              {/* 1. Explore Menu Button */}
              <button
                id="hero-explore-menu-btn"
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#8C5D3B] hover:bg-[#754C2F] rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Coffee className="w-4 h-4 text-amber-200" />
                <span>Explore Menu</span>
              </button>

              {/* 2. Book a Table Button */}
              <button
                id="hero-book-table-btn"
                onClick={onBookTable}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/30 hover:border-white/60 rounded-full backdrop-blur-xs transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Book a Table</span>
              </button>

              {/* 3. Daily Specials Quick Link */}
              <button
                id="hero-daily-specials-btn"
                onClick={() => {
                  const el = document.getElementById('daily-specials');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold text-amber-200 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 hover:border-amber-400 rounded-full backdrop-blur-xs transition-all cursor-pointer shadow-sm"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>⚡ Daily Specials</span>
              </button>

              {/* 4. Weather-Synced Menu Quick Link */}
              <button
                id="hero-weather-menu-btn"
                onClick={() => {
                  const el = document.getElementById('weather-pairing');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onExploreMenu();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold text-amber-200 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 hover:border-amber-400/50 rounded-full backdrop-blur-xs transition-all cursor-pointer"
              >
                <span>🌤️ Weather Menu</span>
              </button>

              {/* 4. Map & Directions */}
              <button
                id="hero-map-btn"
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold text-amber-200 bg-black/40 hover:bg-black/60 border border-white/20 hover:border-white/50 rounded-full backdrop-blur-xs transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Map & Directions</span>
              </button>
            </div>
          </div>

          {/* Right Column: Rotating Daily Recommendation Card (Staff Pick) */}
          <div className="lg:col-span-5">
            <div className="bg-[#24150D]/85 backdrop-blur-md rounded-3xl border border-amber-600/30 p-5 sm:p-6 shadow-2xl space-y-4 text-white">
              {/* Badge & Day Indicator */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] font-bold text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STAFF PICK OF THE DAY</span>
                </div>
                <span className="text-xs text-amber-200/80 font-mono">
                  {todayPick.dayName} Recommendation
                </span>
              </div>

              {/* Item Info with Thumbnail */}
              <div className="flex gap-3.5 items-center">
                <div
                  onClick={() => onSelectItemForModal && onSelectItemForModal(todayItem)}
                  className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-stone-900 shrink-0 border border-amber-500/30 cursor-pointer group"
                >
                  <img
                    src={todayItem.image}
                    alt={todayItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    {todayPick.theme}
                  </span>
                  <h3
                    onClick={() => onSelectItemForModal && onSelectItemForModal(todayItem)}
                    className="font-serif text-lg font-bold text-white hover:text-amber-200 transition-colors cursor-pointer truncate"
                  >
                    {todayItem.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-1">
                    {todayItem.description}
                  </p>
                  <div className="mt-1 text-sm font-bold text-amber-300">
                    ₹{todayItem.price}
                  </div>
                </div>
              </div>

              {/* Barista Personal Note in Quotes */}
              <div className="p-3.5 rounded-2xl bg-[#190E08]/80 border border-amber-700/30 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={todayPick.baristaAvatar}
                      alt={todayPick.baristaName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/70"
                    />
                    <div>
                      <strong className="text-xs font-semibold text-stone-200 block leading-tight">
                        {todayPick.baristaName}
                      </strong>
                      <span className="text-[10px] text-amber-300/80 block leading-tight">
                        {todayPick.baristaRole}
                      </span>
                    </div>
                  </div>
                  <Quote className="w-4 h-4 text-amber-400/40 shrink-0" />
                </div>
                <p className="font-serif italic text-xs text-amber-100/90 leading-relaxed">
                  "{todayPick.personalNote}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center gap-2">
                {onAddToTray && (
                  <button
                    onClick={() => onAddToTray(todayItem)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      isTodayItemInTray
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                    }`}
                  >
                    {isTodayItemInTray ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Tray</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Tray (₹{todayItem.price})</span>
                      </>
                    )}
                  </button>
                )}

                {onScrollToStaffPicks ? (
                  <button
                    onClick={onScrollToStaffPicks}
                    className="inline-flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold text-amber-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors cursor-pointer"
                  >
                    <span>All 7 Days</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    onClick={onExploreMenu}
                    className="inline-flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold text-amber-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors cursor-pointer"
                  >
                    <span>View Menu</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

