import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Flame,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  RotateCw,
  Play,
  Pause,
  Info,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  Columns2,
} from 'lucide-react';
import { DailySpecialItem, MenuItem } from '../types';
import {
  fetchDailySpecials,
  recordSpecialClaim,
  calculateClosingTimeSeconds,
} from '../services/specialsService';

interface DailySpecialsSectionProps {
  onAddSpecialToTray: (special: DailySpecialItem) => void;
  onSelectItemForModal?: (item: MenuItem) => void;
  trayItemIds: string[];
  onOpenTray?: () => void;
}

export const DailySpecialsSection: React.FC<DailySpecialsSectionProps> = ({
  onAddSpecialToTray,
  onSelectItemForModal,
  trayItemIds,
  onOpenTray,
}) => {
  const [specials, setSpecials] = useState<DailySpecialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'spotlight' | 'grid'>('spotlight');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(calculateClosingTimeSeconds());
  const [justClaimedId, setJustClaimedId] = useState<string | null>(null);

  const ROTATION_INTERVAL_MS = 6500;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Load specials from service on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchDailySpecials(false);
        if (mounted) {
          setSpecials(result.specials);
          setSecondsRemaining(result.closingTimeSeconds);
        }
      } catch (err) {
        console.error('Error fetching specials:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Ticking countdown timer for urgency
  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : calculateClosingTimeSeconds()));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Format seconds to HH:MM:SS
  const formattedCountdown = useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;
    return `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
  }, [secondsRemaining]);

  // Handle auto-rotation
  useEffect(() => {
    if (!isAutoRotating || isHovered || loading || specials.length === 0 || viewMode === 'grid') {
      setProgressPercent(0);
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const startTime = Date.now();
    setProgressPercent(0);

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / ROTATION_INTERVAL_MS) * 100);
      setProgressPercent(pct);
    }, 50);

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % specials.length);
      setProgressPercent(0);
    }, ROTATION_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isAutoRotating, isHovered, loading, specials.length, activeIndex, viewMode]);

  const handleNext = () => {
    if (specials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % specials.length);
    setProgressPercent(0);
  };

  const handlePrev = () => {
    if (specials.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + specials.length) % specials.length);
    setProgressPercent(0);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchDailySpecials(true);
      setSpecials(result.specials);
      setSecondsRemaining(result.closingTimeSeconds);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleClaim = (item: DailySpecialItem) => {
    // Record claim in service to decrement stock
    const updated = recordSpecialClaim(item.id);
    if (updated) {
      setSpecials((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }

    onAddSpecialToTray(item);
    setJustClaimedId(item.id);
    setTimeout(() => setJustClaimedId(null), 2500);
  };

  const handleViewDetails = (item: DailySpecialItem) => {
    if (!onSelectItemForModal) return;
    const menuItem: MenuItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.specialPrice,
      description: item.description,
      dietary: item.dietary,
      image: item.image,
      tags: ['Daily Special', item.badge, `${item.discountPercent}% OFF`],
      preparationTime: item.preparationTime,
      calories: item.calories,
    };
    onSelectItemForModal(menuItem);
  };

  const activeSpecial = specials[activeIndex] || specials[0];

  return (
    <section
      id="daily-specials"
      className="relative py-14 sm:py-20 bg-[#160D08] dark:bg-[#0F0805] text-stone-100 overflow-hidden border-y border-amber-900/30"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-orange-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Bar with Urgency Tickers */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Limited-Time Artisanal Drops</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Today's Daily Specials
            </h2>
            <p className="text-stone-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              Handcrafted in limited morning roasts and small bakery batches. Each special is priced exclusively for today and rotates once sold out.
            </p>
          </div>

          {/* Real-Time Urgency Countdown Card */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#24150E] border border-amber-800/40 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-medium text-stone-400">
                  Today's Window Closes In
                </div>
                <div className="font-mono text-lg sm:text-xl font-bold text-amber-200">
                  {formattedCountdown}
                </div>
              </div>
            </div>

            {/* Refresh / View Toggles */}
            <div className="flex items-center gap-1.5 bg-[#24150E] border border-amber-800/40 p-1.5 rounded-2xl">
              <button
                onClick={handleManualRefresh}
                title="Refresh Live Batch Availability"
                disabled={isRefreshing}
                className="p-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-amber-950/60 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              </button>
              <div className="w-px h-6 bg-stone-700/40" />
              <button
                onClick={() => setViewMode('spotlight')}
                title="Spotlight View"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'spotlight'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-amber-950/60'
                }`}
              >
                <Columns2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="View All Grid"
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-amber-950/60'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= LOADING STATE SKELETON ================= */}
        {loading && (
          <div className="bg-[#24150E] rounded-3xl border border-amber-900/40 p-8 sm:p-12 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 aspect-[4/3] bg-stone-800/60 rounded-2xl" />
              <div className="lg:col-span-6 space-y-4">
                <div className="h-6 w-32 bg-stone-800/60 rounded-full" />
                <div className="h-10 w-3/4 bg-stone-800/60 rounded-lg" />
                <div className="h-4 w-full bg-stone-800/60 rounded" />
                <div className="h-4 w-2/3 bg-stone-800/60 rounded" />
                <div className="h-14 w-48 bg-stone-800/60 rounded-xl mt-6" />
              </div>
            </div>
          </div>
        )}

        {/* ================= SPOTLIGHT ROTATING VIEW ================= */}
        {!loading && viewMode === 'spotlight' && activeSpecial && (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="space-y-8"
          >
            {/* Auto-Rotation Progress Bar */}
            <div className="w-full bg-stone-800/60 h-1 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Featured Special Card */}
            <div className="bg-gradient-to-br from-[#24150E] via-[#1E110A] to-[#170C06] rounded-3xl border border-amber-600/30 overflow-hidden shadow-2xl relative">
              {/* Top Bar inside Card: Rotation Tracker & Urgency Ticker */}
              <div className="px-6 py-3 bg-black/40 border-b border-amber-900/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">
                    {activeSpecial.orderCountRecent || 4} guests ordered this special today
                  </span>
                </div>
                <div className="flex items-center gap-3 text-stone-400">
                  <span className="hidden sm:inline">
                    Special {activeIndex + 1} of {specials.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      title={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
                      className="p-1 rounded hover:bg-stone-700/50 text-stone-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {isAutoRotating ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={handlePrev}
                      className="p-1 rounded hover:bg-stone-700/50 text-stone-300 hover:text-white transition-colors cursor-pointer"
                      title="Previous special"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-1 rounded hover:bg-stone-700/50 text-stone-300 hover:text-white transition-colors cursor-pointer"
                      title="Next special"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left: Product Visual */}
                <div className="lg:col-span-6 relative group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-amber-500/20 bg-stone-900">
                    <img
                      src={activeSpecial.image}
                      alt={activeSpecial.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Urgency Badge Overlay */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-red-600/90 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" />
                        {activeSpecial.badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-black/60 text-amber-300 font-semibold text-[11px] backdrop-blur-sm border border-amber-500/30">
                        {activeSpecial.discountPercent}% OFF TODAY
                      </span>
                    </div>

                    {/* Category & Prep Time */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300">
                      <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-stone-700">
                        {activeSpecial.category} · {activeSpecial.dietary === 'veg' ? '🟢 Pure Veg' : activeSpecial.dietary === 'beverage' ? '☕ Handcrafted Brew' : '🔴 Gourmet Non-Veg'}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-stone-700">
                        ⏱ {activeSpecial.preparationTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Details & Immediate Action */}
                <div className="lg:col-span-6 space-y-6 text-left">
                  {/* Origin Tag */}
                  {activeSpecial.roastOrOrigin && (
                    <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activeSpecial.roastOrOrigin}</span>
                    </div>
                  )}

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                      {activeSpecial.name}
                    </h3>
                    <p className="text-amber-200/90 text-sm sm:text-base font-medium mt-1">
                      {activeSpecial.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                    {activeSpecial.description}
                  </p>

                  {/* Tasting & Flavor Profile Pills */}
                  {activeSpecial.flavorNotes && activeSpecial.flavorNotes.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                        Flavor Notes Profile
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeSpecial.flavorNotes.map((note) => (
                          <span
                            key={note}
                            className="px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-800/40 text-amber-200 text-xs font-medium"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scarcity & Stock Progress Bar */}
                  {(() => {
                    const remaining = Math.max(0, activeSpecial.limitedQuantity - activeSpecial.claimedQuantity);
                    const percentClaimed = Math.round((activeSpecial.claimedQuantity / activeSpecial.limitedQuantity) * 100);
                    const isUltraLow = remaining <= 4;

                    return (
                      <div className="p-3.5 rounded-xl bg-black/40 border border-amber-900/40 space-y-2">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className={`flex items-center gap-1.5 ${isUltraLow ? 'text-red-400 font-bold' : 'text-amber-300'}`}>
                            <ShieldAlert className="w-4 h-4" />
                            {remaining === 0 ? 'Sold Out for Today' : `Only ${remaining} portions remaining today!`}
                          </span>
                          <span className="text-stone-400">
                            {percentClaimed}% Claimed
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isUltraLow ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-amber-500 to-orange-400'
                            }`}
                            style={{ width: `${percentClaimed}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Chef/Barista Quote */}
                  <div className="text-xs text-stone-400 italic bg-amber-950/20 border-l-2 border-amber-500 pl-3 py-1">
                    "{activeSpecial.chefNote}"
                  </div>

                  {/* Pricing & CTA Controls */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-amber-900/30">
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">
                          ₹{activeSpecial.specialPrice}
                        </span>
                        <span className="text-stone-500 line-through text-lg">
                          ₹{activeSpecial.originalPrice}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                          Save ₹{activeSpecial.originalPrice - activeSpecial.specialPrice}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Includes GST · Valid {activeSpecial.availableUntil}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleViewDetails(activeSpecial)}
                        className="px-4 py-3 rounded-xl border border-amber-700/50 hover:border-amber-500 text-stone-300 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Recipe Notes</span>
                      </button>

                      {(() => {
                        const isAdded = trayItemIds.includes(activeSpecial.id);
                        const isJustClaimed = justClaimedId === activeSpecial.id;
                        const isSoldOut = activeSpecial.limitedQuantity - activeSpecial.claimedQuantity <= 0;

                        return (
                          <button
                            onClick={() => handleClaim(activeSpecial)}
                            disabled={isSoldOut}
                            className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                              isSoldOut
                                ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                                : isJustClaimed || isAdded
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold shadow-amber-950/40 active:scale-95'
                            }`}
                          >
                            {isSoldOut ? (
                              <span>Sold Out</span>
                            ) : isJustClaimed || isAdded ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Claimed in Tray!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>Claim Special</span>
                              </>
                            )}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {specials.map((item, idx) => {
                const isActive = idx === activeIndex;
                const remaining = Math.max(0, item.limitedQuantity - item.claimedQuantity);
                const isLow = remaining <= 4;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveIndex(idx);
                      setProgressPercent(0);
                    }}
                    className={`relative p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-2 overflow-hidden ${
                      isActive
                        ? 'bg-[#2E1B12] border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                        : 'bg-[#1D110A] border-amber-900/30 hover:border-amber-700/50 hover:bg-[#25160E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] font-semibold text-amber-400">
                          ₹{item.specialPrice}{' '}
                          <span className="text-stone-500 line-through font-normal text-[10px]">
                            ₹{item.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-amber-900/30">
                      <span className={isLow ? 'text-red-400 font-bold' : 'text-stone-400'}>
                        {remaining} left
                      </span>
                      <span className="text-amber-400/80 font-medium">
                        -{item.discountPercent}%
                      </span>
                    </div>

                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= MULTI-CARD GRID VIEW ================= */}
        {!loading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specials.map((item) => {
              const remaining = Math.max(0, item.limitedQuantity - item.claimedQuantity);
              const isAdded = trayItemIds.includes(item.id);
              const isLow = remaining <= 4;
              const isSoldOut = remaining <= 0;

              return (
                <div
                  key={item.id}
                  className="bg-[#1E110A] rounded-2xl border border-amber-900/40 hover:border-amber-600/40 transition-all overflow-hidden flex flex-col justify-between shadow-lg group"
                >
                  <div>
                    {/* Visual */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                          {item.badge}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/70 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                          {item.discountPercent}% OFF
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300">
                        <span className={`font-semibold ${isLow ? 'text-red-400' : 'text-amber-200'}`}>
                          {remaining} left today
                        </span>
                        <span className="text-[11px] text-stone-400">
                          ⏱ {item.preparationTime}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-amber-200/80 text-xs font-medium line-clamp-1 mt-0.5">
                          {item.tagline}
                        </p>
                      </div>

                      <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {item.flavorNotes.slice(0, 2).map((note) => (
                          <span
                            key={note}
                            className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-200 text-[10px] border border-amber-800/40"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="p-5 pt-3 border-t border-amber-900/30 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-xl font-bold text-amber-300">
                          ₹{item.specialPrice}
                        </span>
                        <span className="text-stone-500 line-through text-xs">
                          ₹{item.originalPrice}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        Save ₹{item.originalPrice - item.specialPrice}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(item)}
                        title="View Details"
                        className="p-2 rounded-xl border border-stone-700 hover:border-amber-500 text-stone-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleClaim(item)}
                        disabled={isSoldOut}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow ${
                          isSoldOut
                            ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                            : isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                        }`}
                      >
                        {isSoldOut ? (
                          'Sold Out'
                        ) : isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Tray</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Claim</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner Driving Foot-Traffic & Urgency */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-700/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Visiting in person?</span>{' '}
              Mention the <strong className="text-amber-300">"Daily Specials Drop"</strong> to our barista for tabletop bean fragrance sampling.
            </div>
          </div>
          {onOpenTray && (
            <button
              onClick={onOpenTray}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer shrink-0"
            >
              <span>View Your Order Tray</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
