import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Sparkles,
  X,
  Coffee,
  Table as TableIcon,
  Layers,
  Search,
} from 'lucide-react';
import QRCode from 'qrcode';
import { MenuCategory } from '../types';

interface MenuQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: MenuCategory;
  searchQuery: string;
  trayItemCount?: number;
  onToast?: (title: string, description?: string) => void;
}

export const MenuQRCodeModal: React.FC<MenuQRCodeModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  searchQuery,
  trayItemCount = 0,
  onToast,
}) => {
  // Scope of QR Code: 'current' (active filter/category), 'full' (all menu), 'table' (with table #)
  const [qrScope, setQrScope] = useState<'current' | 'full' | 'table'>('current');
  const [tableNumber, setTableNumber] = useState<string>('04');
  const [colorTheme, setColorTheme] = useState<'espresso' | 'amber' | 'classic'>('espresso');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Construct the target URL based on user selections
  const generatedUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const url = new URL(pathname, origin);

    url.searchParams.set('page', 'menu');

    if (qrScope === 'current') {
      if (selectedCategory && selectedCategory !== 'All') {
        url.searchParams.set('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        url.searchParams.set('search', searchQuery.trim());
      }
    } else if (qrScope === 'table') {
      if (selectedCategory && selectedCategory !== 'All') {
        url.searchParams.set('category', selectedCategory);
      }
      url.searchParams.set('table', tableNumber);
    }

    url.searchParams.set('src', 'qr_digital_menu');
    return url.toString();
  }, [qrScope, selectedCategory, searchQuery, tableNumber]);

  // Color palettes for QR code
  const qrColors = useMemo(() => {
    switch (colorTheme) {
      case 'amber':
        return { dark: '#78350F', light: '#FFFBEB' }; // Warm Honey Amber on Pale Cream
      case 'classic':
        return { dark: '#111827', light: '#FFFFFF' }; // Clean Monochrome
      case 'espresso':
      default:
        return { dark: '#2B1810', light: '#FAF7F2' }; // Rich BrewNest Dark Roast on Café Foam
    }
  }, [colorTheme]);

  // Generate QR code data URL whenever URL or color theme changes
  useEffect(() => {
    if (!isOpen || !generatedUrl) return;

    let isMounted = true;
    setIsGenerating(true);

    QRCode.toDataURL(generatedUrl, {
      width: 440,
      margin: 2,
      color: qrColors,
      errorCorrectionLevel: 'H',
    })
      .then((dataUrl) => {
        if (isMounted) {
          setQrDataUrl(dataUrl);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code:', err);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, generatedUrl, qrColors]);

  if (!isOpen) return null;

  // Handle Copy Link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      onToast?.('Link Copied to Clipboard!', 'Share or paste to open digital menu on mobile.');
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Handle Download QR as Image
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    const filenameScope =
      qrScope === 'table'
        ? `table-${tableNumber}`
        : qrScope === 'current'
        ? `menu-${selectedCategory.toLowerCase().replace(/\s+/g, '-')}`
        : 'full-menu';
    a.download = `brewnest-qr-${filenameScope}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onToast?.('QR Code Downloaded!', `Saved brewnest-qr-${filenameScope}.png for print or sharing.`);
  };

  // Human-readable scope description
  const scopeDescription = () => {
    if (qrScope === 'table') {
      return `Encodes Table #${tableNumber} Digital Menu with instant contactless ordering`;
    }
    if (qrScope === 'current') {
      if (selectedCategory !== 'All' && searchQuery.trim()) {
        return `Encodes ${selectedCategory} category filtered by "${searchQuery}"`;
      }
      if (selectedCategory !== 'All') {
        return `Encodes direct link to ${selectedCategory} section`;
      }
      if (searchQuery.trim()) {
        return `Encodes menu search results for "${searchQuery}"`;
      }
      return 'Encodes the current menu selection overview';
    }
    return 'Encodes the complete digital café catalog and beverage list';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#FAF7F2] dark:bg-[#180E08] text-stone-900 dark:text-[#F7EAE1] rounded-3xl border border-stone-300/80 dark:border-amber-950/70 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-200/80 dark:border-amber-950/60 bg-white/60 dark:bg-[#130B06]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                Digital Menu QR Code
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Scan with any smartphone camera for contactless browsing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Scope Selector Tabs */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8C5D3B] dark:text-amber-400">
              Select QR Scope:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setQrScope('current')}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                  qrScope === 'current'
                    ? 'bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 border-[#2B1810] dark:border-amber-500 shadow-xs'
                    : 'bg-white dark:bg-[#20140C] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-950/40 hover:bg-stone-100 dark:hover:bg-[#2C1A10]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="truncate">
                  {selectedCategory !== 'All' ? selectedCategory : 'Current View'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setQrScope('full')}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                  qrScope === 'full'
                    ? 'bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 border-[#2B1810] dark:border-amber-500 shadow-xs'
                    : 'bg-white dark:bg-[#20140C] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-950/40 hover:bg-stone-100 dark:hover:bg-[#2C1A10]'
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span>Full Menu</span>
              </button>

              <button
                type="button"
                onClick={() => setQrScope('table')}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                  qrScope === 'table'
                    ? 'bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 border-[#2B1810] dark:border-amber-500 shadow-xs'
                    : 'bg-white dark:bg-[#20140C] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-950/40 hover:bg-stone-100 dark:hover:bg-[#2C1A10]'
                }`}
              >
                <TableIcon className="w-4 h-4" />
                <span>Table Stand</span>
              </button>
            </div>
          </div>

          {/* Conditional Table Number selector */}
          {qrScope === 'table' && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-[#21140D] border border-amber-200/80 dark:border-amber-950/60 flex items-center justify-between gap-3 animate-in fade-in duration-150">
              <div>
                <span className="text-xs font-bold text-[#2B1810] dark:text-amber-200 block">
                  Table Number:
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  Guests scanning will automatically be recognized at this table
                </span>
              </div>
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#180E08] border border-amber-300 dark:border-amber-900/70 text-[#2B1810] dark:text-amber-100 focus:outline-none focus:ring-1 focus:ring-[#8C5D3B]"
              >
                {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'Outdoor Patio', 'Balcony Deck'].map(
                  (t) => (
                    <option key={t} value={t}>
                      Table {t}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* QR Display Card */}
          <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-[#130B06] border border-stone-200 dark:border-amber-950/70 shadow-inner">
            {/* Center Coffee Emblem preview inside QR */}
            <div className="relative p-3 bg-white rounded-2xl border-4 border-[#2B1810]/10 dark:border-amber-500/20 shadow-sm">
              {qrDataUrl ? (
                <div className="relative">
                  <img
                    src={qrDataUrl}
                    alt="Digital Menu QR Code"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                  />
                  {/* Subtle centered brand logo overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-[#2B1810] border-2 border-white shadow-md flex items-center justify-center text-amber-200">
                      <Coffee className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center text-stone-400">
                  <QrCode className="w-12 h-12 animate-pulse" />
                </div>
              )}
            </div>

            {/* Scope Badge under QR */}
            <div className="mt-4 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/40">
                <Sparkles className="w-3 h-3" />
                <span>
                  {qrScope === 'table'
                    ? `Table #${tableNumber} Stand Menu`
                    : qrScope === 'current' && selectedCategory !== 'All'
                    ? `${selectedCategory} Collection`
                    : 'Full Digital Menu'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm">
                {scopeDescription()}
              </p>
            </div>

            {/* Color Palette Switcher */}
            <div className="mt-4 flex items-center gap-2 pt-2 border-t border-stone-200/60 dark:border-amber-950/40 w-full justify-center">
              <span className="text-[11px] font-semibold text-stone-400">Aesthetic:</span>
              <button
                type="button"
                onClick={() => setColorTheme('espresso')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  colorTheme === 'espresso'
                    ? 'bg-[#2B1810] text-amber-200 ring-1 ring-amber-400'
                    : 'bg-stone-100 dark:bg-[#20140C] text-stone-600 dark:text-stone-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#2B1810]" />
                <span>Espresso Roast</span>
              </button>

              <button
                type="button"
                onClick={() => setColorTheme('amber')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  colorTheme === 'amber'
                    ? 'bg-amber-700 text-amber-100 ring-1 ring-amber-300'
                    : 'bg-stone-100 dark:bg-[#20140C] text-stone-600 dark:text-stone-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Golden Honey</span>
              </button>

              <button
                type="button"
                onClick={() => setColorTheme('classic')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  colorTheme === 'classic'
                    ? 'bg-black text-white ring-1 ring-stone-400'
                    : 'bg-stone-100 dark:bg-[#20140C] text-stone-600 dark:text-stone-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-black" />
                <span>Monochrome</span>
              </button>
            </div>
          </div>

          {/* Encoded URL & Copy bar */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Encoded Mobile URL:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#120A05] border border-stone-300/80 dark:border-amber-950/60 font-mono text-xs text-stone-700 dark:text-amber-200 truncate select-all">
                {generatedUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#20140C] hover:bg-stone-100 dark:hover:bg-[#2C1A10] text-stone-800 dark:text-stone-200 border border-stone-300/80 dark:border-amber-950/60 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadQR}
              disabled={!qrDataUrl || isGenerating}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold text-amber-100 dark:text-stone-950 bg-[#2B1810] hover:bg-[#1E110A] dark:bg-amber-500 dark:hover:bg-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable QR Image</span>
            </button>

            <a
              href={generatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-[#20140C] hover:bg-stone-100 dark:hover:bg-[#2C1A10] border border-stone-300 dark:border-amber-950/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Test on Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick instructions pill */}
          <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-[#1C1008] border border-stone-200 dark:border-amber-950/40 flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-400">
            <Smartphone className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Tip for Guests & Staff:</strong> Open your smartphone's built-in Camera app or Google Lens and point it directly at the screen to instantly load this digital menu with zero app download required.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
