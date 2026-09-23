import React, { useState, useMemo, useEffect } from 'react';
import {
  Coffee,
  Cookie,
  Sparkles,
  Plus,
  Check,
  ArrowRight,
  Flame,
  Zap,
  Info,
  Heart,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { MENU_ITEMS } from '../data/cafeData';
import { MenuItem } from '../types';

interface PairingRule {
  flavorKeywords: string[];
  suggestedSnackId: string;
  backupSnackId: string;
  matchScore: number;
  pairingTitle: string;
  tasteBalanceReason: string;
  sommelierTip: string;
}

// Simple deterministic recommendation matrix based on coffee characteristics & flavor balancing principles
const PAIRING_RULES: Record<string, PairingRule> = {
  // Rich concentrated espresso: Needs buttery fats to cut acidity or sweet crisp bakes
  'coffee-espresso': {
    flavorKeywords: ['Bold', 'Dense Crema', 'Intense Roast'],
    suggestedSnackId: 'snack-garlic-bread',
    backupSnackId: 'snack-sandwich',
    matchScore: 98,
    pairingTitle: 'Savory Crust & Intense Crema',
    tasteBalanceReason:
      'The concentrated extraction and slight astringency of a single shot cut effortlessly through the melted herb butter and toasted sourdough crust.',
    sommelierTip: 'Sip half your espresso first, take a warm bite of garlic bread, then finish the cup.',
  },
  // Clean, aromatic Americano: Great with savory layered crunch or loaded chips
  'coffee-americano': {
    flavorKeywords: ['Smooth', 'Aromatic', 'Clean Body'],
    suggestedSnackId: 'snack-nachos',
    backupSnackId: 'snack-fries',
    matchScore: 94,
    pairingTitle: 'Clean Palate & Zesty Crunch',
    tasteBalanceReason:
      'Americano’s high hydration and subtle roast notes cleanse the palate between tangy jalapeño bites and rich queso dips.',
    sommelierTip: 'Perfect for long conversation or focused laptop work.',
  },
  // Dense velvety foam & cocoa dusting: Pairs universally with warm melted cheddar & herbs
  'coffee-cappuccino': {
    flavorKeywords: ['Silky Foam', 'Cocoa Dust', 'Harmonious'],
    suggestedSnackId: 'snack-sandwich',
    backupSnackId: 'snack-garlic-bread',
    matchScore: 99,
    pairingTitle: 'Velvet Cloud & Melty Sourdough',
    tasteBalanceReason:
      'The airy microfoam contrasts the crispy griddled artisan sourdough bread and sharp melted cheddar, creating a classic bistro harmony.',
    sommelierTip: 'Our #1 all-time customer requested breakfast & mid-day combo.',
  },
  // Creamy mild milk: Needs spiced savory depth like marinated paneer wrap
  'coffee-latte': {
    flavorKeywords: ['Creamy', 'Mild Sweetness', 'Handcrafted Foam'],
    suggestedSnackId: 'snack-paneer-wrap',
    backupSnackId: 'snack-sandwich',
    matchScore: 96,
    pairingTitle: 'Creamy Sweet & Mint Chutney Contrast',
    tasteBalanceReason:
      'The natural lactose sweetness in steamed milk rounds out the warm tandoori spice and fresh mint chutney inside the paneer wrap.',
    sommelierTip: 'Balances a full afternoon appetite without feeling heavy.',
  },
  // Decadent bittersweet chocolate: Pairs cleanly with salted golden fries
  'coffee-mocha': {
    flavorKeywords: ['Dark Chocolate', 'Bittersweet', 'Whipped Cream'],
    suggestedSnackId: 'snack-fries',
    backupSnackId: 'snack-nachos',
    matchScore: 95,
    pairingTitle: 'Sweet Chocolate & Sea-Salt Chemistry',
    tasteBalanceReason:
      'The culinary golden ratio: sea salt on hot crispy potato fingers elevates the cocoa notes and cuts through dark chocolate indulgence.',
    sommelierTip: 'Dip a hot fry into the mocha foam for a playful sweet-salty sensation.',
  },
  // Slow-steeped 16hr iced cold brew: Needs crisp, hearty texture like a brioche burger
  'coffee-cold-brew': {
    flavorKeywords: ['Zero Acidity', '16-Hour Steep', 'Deep Notes'],
    suggestedSnackId: 'snack-burger',
    backupSnackId: 'snack-fries',
    matchScore: 97,
    pairingTitle: 'Crisp Refreshment & Hearty Brioche',
    tasteBalanceReason:
      'Low acidity and deep malt undertones of slow-steeped cold brew slice through savory burger sauces and toasted brioche buns.',
    sommelierTip: 'Best enjoyed chilled over crystal artisanal ice cubes.',
  },
  // Chilled vanilla bean latte: Sweet floral notes pair with savory crispy fries
  'coffee-iced-latte': {
    flavorKeywords: ['Vanilla Bean', 'Chilled Milk', 'Sweet Floral'],
    suggestedSnackId: 'snack-fries',
    backupSnackId: 'snack-sandwich',
    matchScore: 93,
    pairingTitle: 'Chilled Sweetness & Golden Crisp',
    tasteBalanceReason:
      'The aromatic sweetness of real Madagascar vanilla provides a refreshing counterpoint to salty, crisp potato fingers.',
    sommelierTip: 'A favorite afternoon pick-me-up on warm Noida afternoons.',
  },
  // Sparkling citrus tonic with espresso: Pair with loaded zesty nachos
  'coffee-iced-tonic': {
    flavorKeywords: ['Botanical Tonic', 'Orange Zest', 'Effervescent'],
    suggestedSnackId: 'snack-nachos',
    backupSnackId: 'snack-paneer-wrap',
    matchScore: 96,
    pairingTitle: 'Effervescent Citrus & Loaded Corn Chips',
    tasteBalanceReason:
      'Botanical bubbles and flamed citrus oils mirror the fresh lime in tomato salsa, keeping every chip tasting remarkably fresh.',
    sommelierTip: 'Ultra-refreshing, gourmet, and distinctly artisanal.',
  },
  // Salted caramel blended frappé: Pair with toasted cheesy garlic bread
  'coffee-iced-caramel': {
    flavorKeywords: ['Salted Caramel', 'Crunchy Crumbs', 'Creamy Frappé'],
    suggestedSnackId: 'snack-garlic-bread',
    backupSnackId: 'snack-sandwich',
    matchScore: 92,
    pairingTitle: 'Caramelized Sweet & Roasted Garlic Herbs',
    tasteBalanceReason:
      'The sweet butteriness in salted caramel echoes the rich roasted garlic butter for an indulgent sensory contrast.',
    sommelierTip: 'Order when you crave a rewarding cheat-day treat.',
  },
};

interface PairingSuggestionsProps {
  onAddToTray: (item: MenuItem) => void;
  onAddBothToTray: (coffee: MenuItem, snack: MenuItem) => void;
  onSelectItemForModal?: (item: MenuItem) => void;
  trayItemIds: string[];
}

export const PairingSuggestions: React.FC<PairingSuggestionsProps> = ({
  onAddToTray,
  onAddBothToTray,
  onSelectItemForModal,
  trayItemIds,
}) => {
  // All coffee items from the menu
  const coffeeList = useMemo(() => {
    return MENU_ITEMS.filter((item) => item.category === 'Coffee');
  }, []);

  // All snack items from the menu
  const snackList = useMemo(() => {
    return MENU_ITEMS.filter((item) => item.category === 'Snacks');
  }, []);

  // User's selected favorite coffee (persisted in localStorage or default to signature Cappuccino)
  const [favoriteCoffeeId, setFavoriteCoffeeId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brewnest_favorite_coffee');
      if (saved && coffeeList.some((c) => c.id === saved)) {
        return saved;
      }
    }
    return 'coffee-cappuccino';
  });

  // Save to localStorage whenever user changes their favorite coffee
  const handleSelectFavoriteCoffee = (coffeeId: string) => {
    setFavoriteCoffeeId(coffeeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('brewnest_favorite_coffee', coffeeId);
    }
  };

  const selectedCoffee = useMemo(() => {
    return coffeeList.find((c) => c.id === favoriteCoffeeId) || coffeeList[0];
  }, [coffeeList, favoriteCoffeeId]);

  // Recommendation engine evaluation
  const { recommendedSnack, rule } = useMemo(() => {
    const currentRule =
      PAIRING_RULES[selectedCoffee.id] || {
        flavorKeywords: ['Artisanal Brew', 'Rich Body'],
        suggestedSnackId: 'snack-sandwich',
        backupSnackId: 'snack-fries',
        matchScore: 94,
        pairingTitle: 'Chef’s Balance Pick',
        tasteBalanceReason:
          'A balanced contrast of rich coffee notes with a warm, comforting artisan snack bite.',
        sommelierTip: 'Enjoy while both are fresh and warm from the kitchen.',
      };

    let snack = snackList.find((s) => s.id === currentRule.suggestedSnackId);
    if (!snack) {
      snack = snackList.find((s) => s.id === currentRule.backupSnackId) || snackList[0];
    }

    return {
      recommendedSnack: snack,
      rule: currentRule,
    };
  }, [selectedCoffee, snackList]);

  // Pricing calculations
  const originalComboTotal = (selectedCoffee?.price || 0) + (recommendedSnack?.price || 0);
  const bundleDiscount = 20; // 20 INR pair discount
  const bundlePrice = originalComboTotal - bundleDiscount;

  const isCoffeeInTray = selectedCoffee ? trayItemIds.includes(selectedCoffee.id) : false;
  const isSnackInTray = recommendedSnack ? trayItemIds.includes(recommendedSnack.id) : false;
  const isBothInTray = isCoffeeInTray && isSnackInTray;

  return (
    <div
      id="pairing-suggestions-section"
      className="bg-gradient-to-br from-[#2B1810] via-[#21120B] to-[#170C06] dark:from-[#1E110A] dark:via-[#160D08] dark:to-[#0F0704] rounded-3xl border border-amber-600/30 text-stone-100 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-900/40 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Sommelier Pairing Logic</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Pairing Suggestions
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Tell our recommendation engine your favorite coffee, and we will calculate the ideal snack pairing formulated for flavor balance, fat-acid contrast, and texture harmony.
            </p>
          </div>

          {/* Sommelier Match Score Badge */}
          <div className="flex items-center gap-3 bg-[#180D07] border border-amber-800/50 rounded-2xl px-4 py-3 shrink-0 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
              {rule.matchScore}%
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                Flavor Affinity
              </div>
              <div className="text-xs text-stone-300 font-medium">
                Harmonic Palate Match
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Select Your Current Favorite Coffee */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Step 1: Pick Your Favorite Coffee</span>
            </span>
            <span className="text-stone-400 text-[11px]">
              Tap any coffee to recalculate snack pairing
            </span>
          </div>

          {/* Coffee Horizontal Pill Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-900/40">
            {coffeeList.map((coffee) => {
              const isSelected = coffee.id === selectedCoffee.id;
              return (
                <button
                  key={coffee.id}
                  onClick={() => handleSelectFavoriteCoffee(coffee.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-950/40 scale-[1.02]'
                      : 'bg-[#1D1009] text-stone-300 border-amber-900/40 hover:bg-[#28160D] hover:text-white'
                  }`}
                >
                  <img
                    src={coffee.image}
                    alt={coffee.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
                  <span>{coffee.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-stone-950" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: The Recommended Pair Showcase */}
        <div className="bg-[#190E08] border border-amber-800/40 rounded-2xl p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/30 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Cookie className="w-3.5 h-3.5 text-amber-400" />
                <span>Recommended Snack For Your {selectedCoffee.name}</span>
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                {rule.pairingTitle}
              </h4>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 text-xs font-semibold w-fit">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Save ₹{bundleDiscount} with Barista Combo</span>
            </div>
          </div>

          {/* Visual Combo Cards (Coffee + Snack) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Card: Selected Coffee (md:col-span-5) */}
            <div
              onClick={() => onSelectItemForModal && onSelectItemForModal(selectedCoffee)}
              className="md:col-span-5 bg-[#25150D] rounded-2xl border border-amber-900/40 p-4 flex items-center gap-4 cursor-pointer hover:border-amber-600/50 transition-all group"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-900 shrink-0">
                <img
                  src={selectedCoffee.image}
                  alt={selectedCoffee.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 text-[9px] font-bold">
                  YOUR COFFEE
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <h5 className="font-serif text-base sm:text-lg font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                  {selectedCoffee.name}
                </h5>
                <p className="text-stone-400 text-xs line-clamp-1">
                  {selectedCoffee.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-amber-300 text-sm">
                    ₹{selectedCoffee.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToTray(selectedCoffee);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isCoffeeInTray
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-stone-950 border border-amber-500/30'
                    }`}
                  >
                    {isCoffeeInTray ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{isCoffeeInTray ? 'In Tray' : 'Add Coffee'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Plus Sign Divider (md:col-span-2) */}
            <div className="md:col-span-2 flex flex-col items-center justify-center text-amber-400 gap-1">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-lg">
                +
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                PAIRED WITH
              </span>
            </div>

            {/* Right Card: Suggested Snack (md:col-span-5) */}
            <div
              onClick={() => onSelectItemForModal && onSelectItemForModal(recommendedSnack)}
              className="md:col-span-5 bg-[#25150D] rounded-2xl border border-amber-500/50 p-4 flex items-center gap-4 cursor-pointer hover:border-amber-400 transition-all group ring-1 ring-amber-500/30"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-900 shrink-0">
                <img
                  src={recommendedSnack.image}
                  alt={recommendedSnack.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider">
                  IDEAL SNACK
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <h5 className="font-serif text-base sm:text-lg font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                  {recommendedSnack.name}
                </h5>
                <p className="text-stone-400 text-xs line-clamp-1">
                  {recommendedSnack.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-amber-300 text-sm">
                    ₹{recommendedSnack.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToTray(recommendedSnack);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      isSnackInTray
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-stone-950 border border-amber-500/30'
                    }`}
                  >
                    {isSnackInTray ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{isSnackInTray ? 'In Tray' : 'Add Snack'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Pairing Works: Scientific / Sommelier Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
            <div className="md:col-span-8 bg-[#140A05] p-4 rounded-xl border border-amber-900/30 space-y-1.5 text-xs text-stone-300">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Why This Pairing Works:</span>
              </div>
              <p className="leading-relaxed text-stone-300">
                {rule.tasteBalanceReason}
              </p>
              <div className="text-[11px] text-amber-400/90 italic pt-1 border-t border-amber-950/40">
                💡 Barista Tip: "{rule.sommelierTip}"
              </div>
            </div>

            <div className="md:col-span-4 bg-[#140A05] p-4 rounded-xl border border-amber-900/30 flex flex-col justify-between text-xs space-y-2">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                Pairing Flavor Notes
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rule.flavorKeywords.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300 text-[10px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-stone-400">
                Dietary: <span className="text-emerald-400">🟢 Pure Veg Snack</span>
              </div>
            </div>
          </div>

          {/* Action Footer: Add Full Pairing Combo to Tray */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-amber-900/40">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">
                  ₹{bundlePrice}
                </span>
                <span className="text-stone-500 line-through text-sm">
                  ₹{originalComboTotal}
                </span>
                <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/40">
                  Bundle Deal (-₹{bundleDiscount})
                </span>
              </div>
              <div className="text-[11px] text-stone-400">
                Includes {selectedCoffee.name} + {recommendedSnack.name} with tabletop discount
              </div>
            </div>

            <button
              onClick={() => onAddBothToTray(selectedCoffee, recommendedSnack)}
              className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                isBothInTray
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold shadow-amber-950/40 active:scale-95'
              }`}
            >
              {isBothInTray ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Both in Your Tray!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Pairing Combo to Tray (₹{bundlePrice})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
