import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { MenuItemModal } from './components/MenuItemModal';
import { OrderTrayDrawer } from './components/OrderTrayDrawer';
import { AboutSection } from './components/AboutSection';
import { WhyUsSection } from './components/WhyUsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { BookTableModal } from './components/BookTableModal';
import { PitchDeckModal } from './components/PitchDeckModal';
import { AmbientAudioPlayer } from './components/AmbientAudioPlayer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import { BrewNestRewardsDashboard } from './components/BrewNestRewardsDashboard';
import { DailySpecialsSection } from './components/DailySpecialsSection';
import { DailySpecialItem, MenuItem, NavPage, TrayItem } from './types';
import { MENU_ITEMS } from './data/cafeData';

export default function App() {
  // Navigation state matching screenshot multi-view structure
  const [currentPage, setCurrentPage] = useState<NavPage>('home');

  // Modals state
  const [isBookTableOpen, setIsBookTableOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [activePromoCode, setActivePromoCode] = useState<string | undefined>(undefined);
  const [selectedModalItem, setSelectedModalItem] = useState<MenuItem | null>(null);

  // Inquiry order tray state with customizable TrayItem
  const [trayItems, setTrayItems] = useState<TrayItem[]>([]);

  // Attached items for the contact / reservation form
  const [attachedItems, setAttachedItems] = useState<MenuItem[]>([]);

  // Notification toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
  };

  // Check URL parameters for direct deep-linking from QR code scans
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam && ['home', 'menu', 'about', 'gallery', 'contact'].includes(pageParam)) {
      setCurrentPage(pageParam as NavPage);
    }

    const itemParam = params.get('item');
    if (itemParam) {
      const foundItem = MENU_ITEMS.find((m) => m.id === itemParam);
      if (foundItem) {
        setSelectedModalItem(foundItem);
      }
    }

    const tableParam = params.get('table');
    if (tableParam) {
      addToast(
        `Table #${tableParam} Connected`,
        'Welcome to BrewNest! Browsing contactless digital menu.',
        'info'
      );
    }
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add standard item to tray (Quick Add)
  const handleAddToTray = (item: MenuItem) => {
    setTrayItems((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id && !entry.selectedMilk && entry.selectedSize === 'Regular');
      if (existing) {
        return prev.map((entry) =>
          entry.id === existing.id ? { ...entry, count: entry.count + 1 } : entry
        );
      }
      return [
        ...prev,
        {
          id: `${item.id}-std-${Date.now()}`,
          item,
          count: 1,
          selectedSize: 'Regular',
          unitPrice: item.price,
        },
      ];
    });

    addToast(`Added "${item.name}" to Tray`, `₹${item.price} · Inquiry estimate updated`);
  };

  // Add customized item from modal
  const handleAddToTrayWithOptions = (
    item: MenuItem,
    options: {
      size: string;
      milk?: string;
      sweetness?: string;
      extras: string[];
      calculatedPrice: number;
    }
  ) => {
    const newTrayItem: TrayItem = {
      id: `${item.id}-${options.size}-${options.milk || 'def'}-${Date.now()}`,
      item,
      count: 1,
      selectedSize: options.size,
      selectedMilk: options.milk,
      selectedExtras: options.extras,
      unitPrice: options.calculatedPrice,
    };

    setTrayItems((prev) => [...prev, newTrayItem]);

    const customizationDetails = [options.size, options.milk].filter(Boolean).join(', ');
    addToast(
      `Added Customized "${item.name}"`,
      `₹${options.calculatedPrice}${customizationDetails ? ` (${customizationDetails})` : ''}`
    );
  };

  // Add pairing combo from Mood Matcher
  const handleAddBothToTray = (drink: MenuItem, food: MenuItem) => {
    const drinkTrayItem: TrayItem = {
      id: `${drink.id}-combo-${Date.now()}`,
      item: drink,
      count: 1,
      selectedSize: 'Regular',
      unitPrice: drink.price,
    };

    const foodTrayItem: TrayItem = {
      id: `${food.id}-combo-${Date.now() + 1}`,
      item: food,
      count: 1,
      selectedSize: 'Regular',
      unitPrice: food.price,
    };

    setTrayItems((prev) => [...prev, drinkTrayItem, foodTrayItem]);
    addToast(
      'Curated Pairing Added to Tray!',
      `${drink.name} + ${food.name} (Total ₹${drink.price + food.price})`
    );
  };

  // Update item count in tray
  const handleUpdateTrayCount = (trayId: string, delta: number) => {
    setTrayItems((prev) => {
      return prev
        .map((entry) => {
          if (entry.id === trayId) {
            const newCount = entry.count + delta;
            return newCount > 0 ? { ...entry, count: newCount } : null;
          }
          return entry;
        })
        .filter(Boolean) as TrayItem[];
    });
  };

  // Remove item from tray
  const handleRemoveTrayItem = (trayId: string) => {
    setTrayItems((prev) => prev.filter((entry) => entry.id !== trayId));
    addToast('Item Removed', 'Your inquiry tray was updated', 'info');
  };

  // Clear entire tray
  const handleClearTray = () => {
    setTrayItems([]);
    addToast('Tray Cleared', 'All items removed', 'info');
  };

  // Reorder past order items into active tray
  const handleReorderPastOrder = (
    items: {
      name: string;
      count: number;
      unitPrice: number;
      selectedSize?: string;
      selectedMilk?: string;
    }[]
  ) => {
    const newTrayEntries: TrayItem[] = items.map((it) => {
      const matched: MenuItem =
        MENU_ITEMS.find((m) => m.name.toLowerCase() === it.name.toLowerCase()) || {
          id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: it.name,
          category: 'Coffee',
          price: it.unitPrice,
          dietary: 'beverage',
          description: 'Specialty selection from your past order.',
          image:
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
          tags: ['Reordered'],
          isSignature: false,
        };

      return {
        id: `${matched.id}-reorder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        item: matched,
        count: it.count,
        selectedSize: it.selectedSize || 'Regular',
        selectedMilk: it.selectedMilk,
        unitPrice: it.unitPrice,
      };
    });

    setTrayItems((prev) => [...prev, ...newTrayEntries]);
    setIsRewardsOpen(false);
    setIsTrayOpen(true);
    addToast(
      'Past Order Re-added to Tray!',
      `${items.length} item(s) added back into your order tray.`
    );
  };

  // Add daily special item to tray with special promotional price
  const handleAddSpecialToTray = (special: DailySpecialItem) => {
    const specialMenuItem: MenuItem = {
      id: special.id,
      name: special.name,
      category: special.category,
      price: special.specialPrice,
      description: special.description,
      dietary: special.dietary,
      image: special.image,
      tags: ['Daily Special', special.badge, `${special.discountPercent}% OFF`],
      preparationTime: special.preparationTime,
      calories: special.calories,
    };

    const newTrayItem: TrayItem = {
      id: `${special.id}-special-${Date.now()}`,
      item: specialMenuItem,
      count: 1,
      selectedSize: 'Regular',
      unitPrice: special.specialPrice,
    };

    setTrayItems((prev) => {
      const existing = prev.find((entry) => entry.item.id === special.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === existing.id ? { ...entry, count: entry.count + 1 } : entry
        );
      }
      return [...prev, newTrayItem];
    });

    addToast(
      `Claimed Daily Special: ${special.name}`,
      `₹${special.specialPrice} (Saved ₹${special.originalPrice - special.specialPrice}) · Added to your tray!`
    );
  };

  // Transfer tray items to reservation form
  const handleProceedToInquiry = () => {
    const items = trayItems.map((entry) => entry.item);
    setAttachedItems(items);
    setIsTrayOpen(false);
    setCurrentPage('contact');
    addToast(
      'Attached to Reservation Form',
      `${items.length} items mapped to your message.`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalTrayCount = trayItems.reduce((sum, entry) => sum + entry.count, 0);
  const trayItemIds = trayItems.map((entry) => entry.item.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#120A06] text-stone-800 dark:text-stone-100 transition-colors duration-300 selection:bg-amber-200 selection:text-amber-900 relative">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Floating Ambient Soundscape Synthesizer */}
      <AmbientAudioPlayer />

      {/* Sticky Top Navigation matching screenshot */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        trayCount={totalTrayCount}
        onOpenTray={() => setIsTrayOpen(true)}
        onOpenBookTable={() => setIsBookTableOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onThemeSwitchedToast={(themeTitle) => {
          addToast(
            `Theme: ${themeTitle}`,
            themeTitle === 'Evening Lounge'
              ? 'Dimmed jazz ambience & warm amber glow'
              : 'Sunlit morning café & fresh roast energy',
            'info'
          );
        }}
      />

      {/* Main Page Content depending on active tab */}
      <main className="flex-1">
        {/* ================= HOME VIEW (Screen 1 & 6) ================= */}
        {currentPage === 'home' && (
          <>
            {/* 1. Hero with dark coffee ambience & rotating staff pick */}
            <Hero
              onExploreMenu={() => handleNavigate('menu')}
              onBookTable={() => setIsBookTableOpen(true)}
              onAddToTray={handleAddToTray}
              onSelectItemForModal={(item) => setSelectedModalItem(item)}
              trayItemIds={trayItemIds}
              onScrollToStaffPicks={() => {
                const el = document.getElementById('staff-picks');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNavigate('menu');
                }
              }}
            />

            {/* 2. Daily Specials (Limited-Time Rotating Drops to Drive Urgency) */}
            <DailySpecialsSection
              onAddSpecialToTray={handleAddSpecialToTray}
              onSelectItemForModal={(item) => setSelectedModalItem(item)}
              trayItemIds={trayItemIds}
              onOpenTray={() => setIsTrayOpen(true)}
            />

            {/* 3. Why Choose Us (What Makes BrewNest Special?) */}
            <WhyUsSection />

            {/* 3. Our Menu Preview (Freshly Made, Just for You - 4 cards + View Full Menu) */}
            <MenuSection
              isPreview={true}
              onExploreFullMenu={() => handleNavigate('menu')}
              onSelectItemForModal={(item) => setSelectedModalItem(item)}
              onAddToTray={handleAddToTray}
              onAddBothToTray={handleAddBothToTray}
              trayItemIds={trayItemIds}
              onShowToast={addToast}
              onOpenRewards={() => setIsRewardsOpen(true)}
            />

            {/* 4. About Us Preview (Story & Quote) */}
            <AboutSection showHeaderBanner={false} />

            {/* 5. Gallery Preview (Moments & Vibes) */}
            <GallerySection showHeaderBanner={false} />

            {/* 6. Contact Us Preview */}
            <ContactSection
              showHeaderBanner={false}
              attachedItems={attachedItems}
              onClearAttachedItems={() => setAttachedItems([])}
              onShowToast={addToast}
              onNavigateToMenu={() => handleNavigate('menu')}
            />
          </>
        )}

        {/* ================= ABOUT VIEW (Screen 2) ================= */}
        {currentPage === 'about' && (
          <>
            <AboutSection showHeaderBanner={true} />
            <WhyUsSection />
          </>
        )}

        {/* ================= MENU VIEW (Screen 3) ================= */}
        {currentPage === 'menu' && (
          <MenuSection
            isPreview={false}
            onSelectItemForModal={(item) => setSelectedModalItem(item)}
            onAddToTray={handleAddToTray}
            onAddBothToTray={handleAddBothToTray}
            trayItemIds={trayItemIds}
            onShowToast={addToast}
            onOpenRewards={() => setIsRewardsOpen(true)}
          />
        )}

        {/* ================= GALLERY VIEW (Screen 4) ================= */}
        {currentPage === 'gallery' && (
          <GallerySection showHeaderBanner={true} />
        )}

        {/* ================= CONTACT VIEW (Screen 5) ================= */}
        {currentPage === 'contact' && (
          <ContactSection
            showHeaderBanner={true}
            attachedItems={attachedItems}
            onClearAttachedItems={() => setAttachedItems([])}
            onShowToast={addToast}
            onNavigateToMenu={() => handleNavigate('menu')}
          />
        )}
      </main>

      {/* Footer matching screenshot */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPitch={() => setIsPitchOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onShowToast={addToast}
      />

      {/* "Book a Table" Modal with live reservation ticket & Live Waitlist Queue */}
      <BookTableModal
        isOpen={isBookTableOpen}
        onClose={() => setIsBookTableOpen(false)}
        onBookingConfirmed={(ticket) => {
          addToast('Table Booked!', `Reference ${ticket.ref} confirmed for ${ticket.date}`);
        }}
        onShowToast={addToast}
        onTableReadyNavigate={(tbl) => {
          handleNavigate('menu');
          addToast(`Seated at ${tbl}!`, 'Digital menu is now synchronized for your table orders.');
        }}
      />

      {/* Item Detail Quick-View & Customizer Modal */}
      <MenuItemModal
        item={selectedModalItem}
        isOpen={selectedModalItem !== null}
        onClose={() => setSelectedModalItem(null)}
        onAddToTrayWithOptions={handleAddToTrayWithOptions}
        isInTray={selectedModalItem ? trayItemIds.includes(selectedModalItem.id) : false}
      />

      {/* Order / Inquiry Tray Drawer with Promo Simulator & Tax Breakdown */}
      <OrderTrayDrawer
        isOpen={isTrayOpen}
        onClose={() => setIsTrayOpen(false)}
        trayItems={trayItems}
        onUpdateCount={handleUpdateTrayCount}
        onRemoveItem={handleRemoveTrayItem}
        onClearTray={handleClearTray}
        onProceedToInquiry={handleProceedToInquiry}
        onCopyTraySummary={() => addToast('Summary Copied', 'Receipt copied to clipboard')}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onShowToast={addToast}
        initialPromoCode={activePromoCode}
      />

      {/* BrewNest Rewards Loyalty Dashboard Modal */}
      <BrewNestRewardsDashboard
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        onApplyCouponToTray={(code) => {
          setActivePromoCode(code);
          setIsTrayOpen(true);
        }}
        onOpenTray={() => setIsTrayOpen(true)}
        onShowToast={addToast}
        onReorderPastOrder={handleReorderPastOrder}
      />

      {/* Concept Presentation Deck Modal */}
      <PitchDeckModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />
    </div>
  );
}
