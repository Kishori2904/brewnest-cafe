import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Check, Search, Coffee, ArrowRight, Sparkles, QrCode, Crown, Award } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/cafeData';
import { MenuCategory, MenuItem } from '../types';
import { MoodPairingWidget } from './MoodPairingWidget';
import { StaffPicksSection } from './StaffPicksSection';
import { WeatherRecommendationsWidget } from './WeatherRecommendationsWidget';
import { MenuQRCodeModal } from './MenuQRCodeModal';
import { PairingSuggestions } from './PairingSuggestions';

interface MenuSectionProps {
  isPreview?: boolean;
  onExploreFullMenu?: () => void;
  onSelectItemForModal: (item: MenuItem) => void;
  onAddToTray: (item: MenuItem) => void;
  onAddBothToTray: (drink: MenuItem, food: MenuItem) => void;
  trayItemIds: string[];
  onShowToast?: (title: string, description?: string) => void;
  onOpenRewards?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  isPreview = false,
  onExploreFullMenu,
  onSelectItemForModal,
  onAddToTray,
  onAddBothToTray,
  trayItemIds,
  onShowToast,
  onOpenRewards,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat && (MENU_CATEGORIES as readonly string[]).includes(cat)) {
        return cat as MenuCategory;
      }
    }
    return 'All';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || '';
    }
    return '';
  });
  const [showMoodMatcher, setShowMoodMatcher] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [activeTableParam, setActiveTableParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const table = params.get('table');
      if (table) setActiveTableParam(table);
    }
  }, []);

  // Filtered items based on category and search
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Preview items for Home page (Screen 1 shows 4 items)
  const previewItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return [
        MENU_ITEMS.find((i) => i.id === 'coffee-latte') || MENU_ITEMS[3],
        MENU_ITEMS.find((i) => i.id === 'coffee-cappuccino') || MENU_ITEMS[2],
        MENU_ITEMS.find((i) => i.id === 'snack-sandwich') || MENU_ITEMS[6],
        MENU_ITEMS.find((i) => i.id === 'dessert-fudge-cake') || MENU_ITEMS[15],
      ];
    }
    return filteredItems.slice(0, 4);
  }, [selectedCategory, filteredItems]);

  // Grouped items for the full menu view (Screen 3)
  const coffeeItems = MENU_ITEMS.filter((i) => i.category === 'Coffee');
  const snackItems = MENU_ITEMS.filter((i) => i.category === 'Snacks');
  const mainItems = MENU_ITEMS.filter((i) => i.category === 'Main Course');
  const dessertItems = MENU_ITEMS.filter((i) => i.category === 'Desserts');

  // Single Item Card matching screenshot
  const renderItemCard = (item: MenuItem) => {
    const isAdded = trayItemIds.includes(item.id);

    return (
      <div
        key={item.id}
        onClick={() => onSelectItemForModal(item)}
        className="group bg-white dark:bg-[#1C120B] rounded-2xl border border-stone-200/90 dark:border-amber-900/40 hover:dark:border-amber-600/40 overflow-hidden shadow-xs hover:shadow-md dark:shadow-black/50 transition-all cursor-pointer flex flex-col"
      >
        {/* Item Image with Rounded Container matching screenshot */}
        <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-900 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            onError={(e) => {
              if (item.vectorAsset && e.currentTarget.src !== item.vectorAsset) {
                e.currentTarget.src = item.vectorAsset;
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Quick Add Plus Button Overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToTray(item);
            }}
            className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2B1810] dark:bg-amber-500 text-amber-200 dark:text-stone-950 hover:bg-[#1E110A] dark:hover:bg-amber-400'
            }`}
            title="Quick add to tray"
            aria-label={`Add ${item.name} to tray`}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Content: Title & Price in INR matching screenshot */}
        <div className="p-3.5 flex flex-col flex-1 justify-between space-y-1">
          <h4 className="font-semibold text-stone-900 dark:text-[#F7EAE1] text-sm group-hover:text-[#8C5D3B] dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {item.name}
          </h4>
          <div className="text-xs font-bold text-stone-800 dark:text-amber-400">
            ₹ {item.price}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#120A06] transition-colors duration-300">
      {/* Top Banner matching Screen 3 (only on full menu page) */}
      {!isPreview && (
        <div className="relative h-64 sm:h-72 lg:h-80 flex items-center justify-center bg-[#1A0E08] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=80"
            alt="Roasted coffee beans background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 text-center space-y-2 px-4">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Our Menu
            </h1>
            <p className="text-sm sm:text-base text-amber-100/90 font-medium">
              Freshly Made, Just for You
            </p>
          </div>
        </div>
      )}

      {/* Main Menu Container */}
      <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isPreview ? 'py-16 sm:py-20 border-b border-stone-200/60 dark:border-amber-950/40' : 'py-12 sm:py-16'}`}>
        <div className="space-y-10">
          {/* Section Header for Preview Mode matching Screen 1 */}
          {isPreview && (
            <div className="text-center space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8C5D3B] dark:text-amber-400">
                — OUR MENU —
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                Freshly Made, Just for You
              </h2>
            </div>
          )}

          {/* Category Filter Pills matching screenshot & Get QR Code button */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {MENU_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-xs'
                      : 'bg-stone-200/70 dark:bg-[#20140C] text-stone-700 dark:text-stone-300 hover:bg-stone-300/70 dark:hover:bg-[#2D1A10] border border-transparent dark:border-amber-950/40'
                  }`}
                >
                  {category}
                </button>
              );
            })}

            {/* Quick Get QR Code Button in filter bar */}
            <button
              id="menu-filter-get-qr-btn"
              onClick={() => setIsQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-bold bg-amber-100/90 dark:bg-[#28160D] text-[#8C5D3B] dark:text-amber-300 hover:bg-amber-200/90 dark:hover:bg-[#382014] border border-amber-300/80 dark:border-amber-800/60 shadow-2xs transition-all cursor-pointer"
              title="Generate QR code for this digital menu selection"
            >
              <QrCode className="w-3.5 h-3.5 text-[#8C5D3B] dark:text-amber-400" />
              <span>Get QR Code</span>
            </button>

            {/* Quick BrewNest Rewards trigger button */}
            {onOpenRewards && (
              <button
                id="menu-filter-rewards-btn"
                onClick={onOpenRewards}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-bold bg-[#2B1810] dark:bg-amber-950/70 text-amber-200 dark:text-amber-300 hover:bg-[#1C100A] dark:hover:bg-amber-900 border border-amber-700/60 dark:border-amber-700/60 shadow-2xs transition-all cursor-pointer"
                title="Open BrewNest Rewards Club & Digital Badges"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Rewards Club</span>
              </button>
            )}
          </div>

          {/* Table Connection Indicator if scanned via table QR */}
          {activeTableParam && (
            <div className="max-w-md mx-auto p-3 rounded-2xl bg-amber-100/90 dark:bg-[#25150C] border border-amber-300 dark:border-amber-900/60 text-center text-xs text-[#2B1810] dark:text-amber-200 font-semibold flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400" />
              <span>Connected to <strong>Table #{activeTableParam}</strong> for Contactless Ordering</span>
            </div>
          )}

          {/* Search bar and Quick QR in full menu mode */}
          {!isPreview && (
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search coffee, burgers, pasta, desserts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-full border border-stone-300 dark:border-amber-900/50 text-xs bg-white dark:bg-[#1C120B] text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#8C5D3B] dark:focus:ring-amber-500"
                />
              </div>

              <button
                id="full-menu-get-qr-action-btn"
                onClick={() => setIsQrModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 hover:bg-[#1E110A] dark:hover:bg-amber-400 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title="Generate QR code for this digital menu"
              >
                <QrCode className="w-4 h-4" />
                <span>Get QR Code</span>
              </button>
            </div>
          )}

          {/* PREVIEW VIEW (Screen 1): Weather suggestions + Staff picks + 4 featured staple items */}
          {isPreview ? (
            <div className="space-y-12">
              {/* Real-time Weather Synced Menu Suggestions */}
              <WeatherRecommendationsWidget
                onAddToTray={onAddToTray}
                onSelectItemForModal={onSelectItemForModal}
                onAddBothToTray={onAddBothToTray}
                trayItemIds={trayItemIds}
              />

              {/* Daily Rotating Barista Recommendation */}
              <StaffPicksSection
                onAddToTray={onAddToTray}
                onSelectItemForModal={onSelectItemForModal}
                onAddBothToTray={onAddBothToTray}
                trayItemIds={trayItemIds}
              />

              {/* Sommelier Pairing Suggestions Engine (Favorite Coffee -> Matched Snack) */}
              <PairingSuggestions
                onAddToTray={onAddToTray}
                onAddBothToTray={onAddBothToTray}
                onSelectItemForModal={onSelectItemForModal}
                trayItemIds={trayItemIds}
              />

              {/* Café Staples Grid */}
              <div className="space-y-6 pt-2">
                <div className="text-center space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8C5D3B] dark:text-amber-400">
                    POPULAR STAPLES
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#F7EAE1]">
                    Customer Favorites
                  </h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {previewItems.map(renderItemCard)}
                </div>
              </div>

              {onExploreFullMenu && (
                <div className="text-center pt-2">
                  <button
                    onClick={onExploreFullMenu}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#2B1810] hover:bg-[#1E110A] dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-stone-950 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <span>View Full Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* FULL MENU VIEW (Screen 3): Categorized sections */
            <div className="space-y-14">
              {/* Weather Synced Suggestions & Daily Rotating Recommendation (Visible when browsing All items without active search) */}
              {selectedCategory === 'All' && searchQuery.trim() === '' && (
                <div className="space-y-10 pb-4">
                  <WeatherRecommendationsWidget
                    onAddToTray={onAddToTray}
                    onSelectItemForModal={onSelectItemForModal}
                    onAddBothToTray={onAddBothToTray}
                    trayItemIds={trayItemIds}
                  />
                  <StaffPicksSection
                    onAddToTray={onAddToTray}
                    onSelectItemForModal={onSelectItemForModal}
                    onAddBothToTray={onAddBothToTray}
                    trayItemIds={trayItemIds}
                  />

                  {/* Sommelier Pairing Suggestions Engine (Favorite Coffee -> Matched Snack) */}
                  <PairingSuggestions
                    onAddToTray={onAddToTray}
                    onAddBothToTray={onAddBothToTray}
                    onSelectItemForModal={onSelectItemForModal}
                    trayItemIds={trayItemIds}
                  />
                </div>
              )}

              {/* If a specific category or search is active, show matching grid */}
              {selectedCategory !== 'All' || searchQuery.trim() !== '' ? (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-[#F7EAE1]">
                    {selectedCategory === 'All' ? `Search Results (${filteredItems.length})` : selectedCategory}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                    {filteredItems.map(renderItemCard)}
                  </div>
                </div>
              ) : (
                /* Full categorized layout matching Screen 3 */
                <>
                  {/* Category 1: Coffee */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                        Coffee
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Rich flavors, perfect sips.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                      {coffeeItems.map(renderItemCard)}
                    </div>
                  </div>

                  {/* Category 2: Snacks */}
                  <div className="space-y-4 pt-4">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                        Snacks
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Perfect bites for your cravings.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                      {snackItems.map(renderItemCard)}
                    </div>
                  </div>

                  {/* Category 3: Main Course */}
                  <div className="space-y-4 pt-4">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                        Main Course
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Hearty meals for a fulfilling day.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                      {mainItems.map(renderItemCard)}
                    </div>
                  </div>

                  {/* Category 4: Desserts */}
                  <div className="space-y-4 pt-4">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                        Desserts
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Sweet endings to wonderful moments.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {dessertItems.map(renderItemCard)}
                    </div>
                  </div>
                </>
              )}

              {/* Barista Mood Pairing Toggle */}
              <div className="pt-6 border-t border-stone-200 dark:border-amber-950/50">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowMoodMatcher(!showMoodMatcher)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/40 hover:bg-amber-200/80 dark:hover:bg-amber-900/40 border border-amber-300 dark:border-amber-800/50 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    <span>{showMoodMatcher ? 'Hide Barista Mood Matcher' : 'Try Barista Mood & Pairing Engine'}</span>
                  </button>
                </div>

                {showMoodMatcher && (
                  <div className="mt-8 animate-in fade-in duration-200">
                    <MoodPairingWidget onAddBothToTray={onAddBothToTray} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Digital Menu QR Code Modal */}
      <MenuQRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        trayItemCount={trayItemIds.length}
        onToast={onShowToast}
      />
    </div>
  );
};
