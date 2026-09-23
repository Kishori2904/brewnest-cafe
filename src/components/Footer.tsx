import React, { useState } from 'react';
import { Coffee, Instagram, Facebook, Twitter, Linkedin, QrCode, ChevronUp, ChevronDown } from 'lucide-react';
import { BUSINESS_INFO } from '../data/cafeData';
import { NavPage } from '../types';
import { TableQRShareCard } from './TableQRShareCard';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
  onOpenPitch?: () => void;
  onOpenRewards?: () => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPitch,
  onOpenRewards,
  onShowToast,
}) => {
  const [showTableQR, setShowTableQR] = useState(false);

  const navItems: { label: string; page: NavPage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Menu', page: 'menu' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C0F08] dark:bg-[#0B0604] text-stone-300 py-12 sm:py-16 border-t border-stone-800 dark:border-amber-950/40 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        {/* Brand Logo & Tagline matching screenshot */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            aria-label="BrewNest Café"
          >
            <img
              src={`${import.meta.env.BASE_URL}Images/logo.png`}
              alt="BrewNest Café"
              className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </button>
          <p className="text-xs uppercase tracking-[0.2em] text-[#C49A7A] font-medium">
            {BUSINESS_INFO.tagline}
          </p>
        </div>

        {/* Navigation Links matching screenshot */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className="text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          {onOpenRewards && (
            <button
              onClick={onOpenRewards}
              className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-semibold"
            >
              BrewNest Rewards 👑
            </button>
          )}

          {/* Quick Table QR Share Trigger in Footer */}
          <button
            onClick={() => setShowTableQR((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all cursor-pointer font-semibold text-xs"
            title="Generate a table QR code to share menu"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Table QR Code</span>
            {showTableQR ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>
        </div>

        {/* Expandable Table QR Share Drawer inside Footer */}
        {showTableQR && (
          <div className="pt-2 text-left max-w-4xl mx-auto animate-fadeIn">
            <TableQRShareCard
              variant="footer"
              onShowToast={onShowToast}
              onNavigateToMenu={() => handleNavClick('menu')}
            />
          </div>
        )}

        {/* Social Icons matching screenshot */}
        <div className="flex justify-center items-center gap-3">
          <a
            href={BUSINESS_INFO.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BrewNest Instagram"
            className="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={BUSINESS_INFO.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BrewNest Facebook"
            className="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href={BUSINESS_INFO.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BrewNest X (Twitter)"
            className="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={BUSINESS_INFO.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BrewNest LinkedIn"
            className="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-800/80 pt-6">
          <p className="text-[11px] text-stone-500">
            © 2026 {BUSINESS_INFO.name} Café. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
