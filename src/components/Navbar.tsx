import React, { useState, useEffect } from 'react';
import { Coffee, Menu as MenuIcon, X, Calendar, ShoppingBag, Crown, Sparkles, Award } from 'lucide-react';
import { BUSINESS_INFO } from '../data/cafeData';
import { NavPage } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { loadRewardsProfile } from '../utils/rewardsStorage';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  trayCount: number;
  onOpenTray: () => void;
  onOpenBookTable: () => void;
  onOpenRewards?: () => void;
  onThemeSwitchedToast?: (themeName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  trayCount,
  onOpenTray,
  onOpenBookTable,
  onOpenRewards,
  onThemeSwitchedToast,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pointsBalance, setPointsBalance] = useState<number>(() => loadRewardsProfile().pointsBalance);
  const [tierName, setTierName] = useState<string>(() => loadRewardsProfile().currentTierName);
  const { themeName, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleRewardsUpdate = () => {
      const p = loadRewardsProfile();
      setPointsBalance(p.pointsBalance);
      setTierName(p.currentTierName);
    };
    window.addEventListener('brewnest_rewards_updated', handleRewardsUpdate);
    return () => window.removeEventListener('brewnest_rewards_updated', handleRewardsUpdate);
  }, []);

  const navItems: { label: string; page: NavPage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Menu', page: 'menu' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 dark:bg-[#140C08]/95 backdrop-blur-md shadow-xs dark:shadow-black/60 border-b border-stone-200/80 dark:border-amber-950/50 py-3'
            : 'bg-[#FAF7F2] dark:bg-[#140C08] py-4 border-b border-stone-200/60 dark:border-amber-950/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo matching screenshot: BrewNest CAFE & MORE */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            aria-label="BrewNest Café Home"
          >
          {/* BrewNest Logo */}
          <div className="flex items-center">
            <img
              src={`${import.meta.env.BASE_URL}Images/logo.png`}
              alt="BrewNest Café"
              className="h-12 w-auto object-contain"
            />
          </div>
          </button>

          {/* Desktop Navigation Links matching screenshot */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`transition-colors py-1 relative cursor-pointer ${
                    isActive
                      ? 'text-[#2B1810] dark:text-amber-300 font-bold after:w-full after:h-0.5 after:bg-[#2B1810] dark:after:bg-amber-400 after:absolute after:bottom-0 after:left-0'
                      : 'text-stone-600 dark:text-stone-300 hover:text-[#2B1810] dark:hover:text-amber-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* BrewNest Rewards Loyalty Club Pill Button */}
            {onOpenRewards && (
              <button
                id="navbar-rewards-btn"
                onClick={onOpenRewards}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-amber-950 dark:text-amber-200 bg-amber-100/90 hover:bg-amber-200/90 dark:bg-amber-950/70 dark:hover:bg-amber-900/80 rounded-full border border-amber-300 dark:border-amber-800/60 shadow-2xs transition-all cursor-pointer"
                title={`BrewNest Rewards · ${tierName} (${pointsBalance} pts)`}
                aria-label="Open BrewNest Rewards Loyalty Dashboard"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-mono text-[11px] sm:text-xs">{pointsBalance} pts</span>
              </button>
            )}

            {/* Global Theme Toggle: Café Day vs Evening Lounge */}
            <ThemeToggle
              variant="compact"
              onThemeSwitched={(name) => onThemeSwitchedToast?.(name)}
            />

            {/* Inquiry Tray Button */}
            <button
              onClick={onOpenTray}
              className="relative p-2 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-amber-200 bg-stone-100/80 dark:bg-[#22140D] hover:bg-stone-200 dark:hover:bg-[#2F1B12] rounded-full transition-colors cursor-pointer border border-stone-200 dark:border-amber-900/40"
              title="View Inquiry Tray"
              aria-label="View Inquiry Tray"
            >
              <ShoppingBag className="w-4 h-4 text-stone-700 dark:text-amber-200" />
              {trayCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold bg-[#8C5D3B] dark:bg-amber-500 text-white dark:text-stone-950 rounded-full flex items-center justify-center">
                  {trayCount}
                </span>
              )}
            </button>

            {/* "Book a Table" Pill Button matching screenshot */}
            <button
              id="navbar-book-table-btn"
              onClick={onOpenBookTable}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2B1810] hover:bg-[#1E110A] dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-stone-950 rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300 dark:text-stone-950" />
              <span>Book a Table</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white rounded-lg md:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu matching Screen 6 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF7F2] dark:bg-[#140C08] border-b border-stone-200 dark:border-amber-950/60 px-5 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Rewards Card in Mobile Menu */}
            {onOpenRewards && (
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRewards();
                }}
                className="p-3 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-[#23150D] dark:to-[#1A0E08] border border-amber-300 dark:border-amber-800/60 rounded-xl flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-200 dark:bg-amber-900/60 flex items-center justify-center text-amber-900 dark:text-amber-300">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      BrewNest Rewards Club
                    </div>
                    <div className="text-[11px] text-amber-800 dark:text-amber-400">
                      {tierName} · {pointsBalance} pts
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Open →
                </span>
              </div>
            )}

            {/* Theme Toggle Card in Mobile Menu */}
            <ThemeToggle
              variant="full"
              onThemeSwitched={(name) => {
                onThemeSwitchedToast?.(name);
              }}
            />

            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleNavClick(item.page)}
                    className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#2B1810] dark:bg-amber-500/20 text-amber-100 dark:text-amber-300 font-bold border border-transparent dark:border-amber-500/30'
                        : 'text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#20140D]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookTable();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold text-white bg-[#2B1810] dark:bg-amber-500 dark:text-stone-950 rounded-full shadow-xs cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-300 dark:text-stone-950" />
                <span>Book a Table</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

