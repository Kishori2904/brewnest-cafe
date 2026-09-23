import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  QrCode,
  Smartphone,
  Share2,
  Copy,
  Check,
  Download,
  Users,
  UtensilsCrossed,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Palette,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';
import QRCode from 'qrcode';

interface TableQRShareCardProps {
  variant?: 'contact' | 'footer';
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateToMenu?: () => void;
}

export const TableQRShareCard: React.FC<TableQRShareCardProps> = ({
  variant = 'contact',
  onShowToast,
  onNavigateToMenu,
}) => {
  const [tableNumber, setTableNumber] = useState<string>('04');
  const [activeTheme, setActiveTheme] = useState<'espresso' | 'amber' | 'classic'>('espresso');
  const [guestNote, setGuestNote] = useState<string>('Browse & Order Together');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedPreview, setExpandedPreview] = useState<boolean>(false);

  // Suggested popular café tables
  const suggestedTables = ['01', '04', '07', '12', 'P1', 'Outdoor-3'];

  // Construct table-specific share URL
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const url = new URL(pathname, origin);

    url.searchParams.set('page', 'menu');
    if (tableNumber.trim()) {
      url.searchParams.set('table', tableNumber.trim());
    }
    url.searchParams.set('src', 'table_qr_share');
    return url.toString();
  }, [tableNumber]);

  // Color schemes for QR code canvas rendering
  const qrColors = useMemo(() => {
    switch (activeTheme) {
      case 'amber':
        return { dark: '#78350F', light: '#FFFBEB' }; // Rich caramel amber on soft warm ivory
      case 'classic':
        return { dark: '#111827', light: '#FFFFFF' }; // Clean monochrome
      case 'espresso':
      default:
        return { dark: '#26140D', light: '#FAF7F2' }; // BrewNest signature dark espresso roast on froth
    }
  }, [activeTheme]);

  // Generate QR code data URL whenever target URL or theme changes
  useEffect(() => {
    if (!shareUrl) return;

    let isMounted = true;
    setIsGenerating(true);

    QRCode.toDataURL(shareUrl, {
      width: 420,
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
        console.error('Failed to generate table QR code', err);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [shareUrl, qrColors]);

  // Copy URL with tactile feedback
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      if (onShowToast) {
        onShowToast(
          'Table Menu Link Copied!',
          `Direct link for Table #${tableNumber || 'General'} is on your clipboard.`,
          'success'
        );
      }
      setTimeout(() => setCopied(false), 2200);
    } catch {
      if (onShowToast) {
        onShowToast('Copy Failed', 'Please copy the link directly.', 'error');
      }
    }
  };

  // Download high-res PNG for printing or saving
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `brewnest-table-${tableNumber || 'menu'}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (onShowToast) {
      onShowToast(
        'QR Code Downloaded',
        `Saved high-res QR badge for Table #${tableNumber}.`,
        'success'
      );
    }
  };

  // Native mobile share sheet if supported
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BrewNest Digital Menu — Table #${tableNumber}`,
          text: `Hey! Check out the BrewNest café digital menu for our table #${tableNumber}:`,
          url: shareUrl,
        });
        if (onShowToast) {
          onShowToast('Shared Successfully', 'Digital menu link sent!', 'success');
        }
      } catch (err: unknown) {
        // User canceled share sheet, ignore
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const isFooter = variant === 'footer';

  return (
    <div
      id="table-qr-share-card"
      className={`rounded-2xl transition-all ${
        isFooter
          ? 'bg-[#24150E] border border-amber-900/50 p-6 sm:p-8 text-stone-100 shadow-xl'
          : 'bg-gradient-to-br from-white via-[#FCFAF8] to-[#F7F2EC] dark:from-[#1A100A] dark:via-[#160D08] dark:to-[#110804] border border-amber-900/20 dark:border-amber-900/40 p-6 sm:p-8 shadow-md'
      }`}
    >
      {/* Header with Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200/80 dark:border-amber-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                Share Digital Menu at Your Table
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                Instant QR
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              Let friends & table guests browse, customize brews, and pick specials on their own phones.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            <Users className="w-3.5 h-3.5" />
            <span>Tabletop Sync</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Controls & Right High-Res QR Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Table Number & Customization Options (md:col-span-7) */}
        <div className="md:col-span-7 space-y-4">
          {/* Table Number Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="table-qr-input"
                className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Your Table / Booth Number</span>
              </label>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Auto-tags menu for table #{tableNumber || '—'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="table-qr-input"
                  type="text"
                  maxLength={12}
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. 04, P2, Outdoor-1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 font-mono text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Quick Table Presets */}
              <div className="hidden sm:flex items-center gap-1">
                {suggestedTables.slice(0, 4).map((tbl) => (
                  <button
                    key={tbl}
                    onClick={() => setTableNumber(tbl)}
                    type="button"
                    className={`px-2.5 py-2 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                      tableNumber === tbl
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-stone-100 dark:bg-[#20140D] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-900/40 hover:bg-stone-200 dark:hover:bg-[#2C1A11]'
                    }`}
                  >
                    #{tbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Palette Chooser */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <span className="text-stone-600 dark:text-stone-400 font-medium flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>QR Color Style:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTheme('espresso')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                  activeTheme === 'espresso'
                    ? 'bg-[#2B1810] text-amber-200 border-amber-600 ring-1 ring-amber-500/40 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-transparent hover:bg-stone-200'
                }`}
              >
                ☕ Espresso
              </button>
              <button
                type="button"
                onClick={() => setActiveTheme('amber')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                  activeTheme === 'amber'
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 ring-1 ring-amber-500/40 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-transparent hover:bg-stone-200'
                }`}
              >
                🍯 Honey Amber
              </button>
              <button
                type="button"
                onClick={() => setActiveTheme('classic')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                  activeTheme === 'classic'
                    ? 'bg-stone-900 text-white border-stone-700 ring-1 ring-stone-400 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-transparent hover:bg-stone-200'
                }`}
              >
                Classic Monotone
              </button>
            </div>
          </div>

          {/* Feature Highlights Bullets */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-stone-600 dark:text-stone-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Zero app install needed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Includes today's daily specials</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Direct camera scanning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Personal diet filters saved</span>
            </div>
          </div>

          {/* Action Buttons: Copy Link, Mobile Share, Download Badge */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-[#20140D] hover:bg-stone-200 dark:hover:bg-[#2C1A11] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-amber-900/40 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  <span>Copy Table Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share to Table</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQR}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-[#20140D] hover:bg-stone-200 dark:hover:bg-[#2C1A11] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-amber-900/40 transition-colors cursor-pointer"
              title="Download QR as PNG"
            >
              <Download className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span>Save Image</span>
            </button>

            {onNavigateToMenu && (
              <button
                type="button"
                onClick={onNavigateToMenu}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors cursor-pointer ml-auto"
              >
                <span>Preview Menu</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: QR Code Display Frame (md:col-span-5) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#120A06] border border-amber-900/20 dark:border-amber-900/50 shadow-xl flex flex-col items-center text-center max-w-[240px] w-full">
            {/* Top Miniature Table Tag */}
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800 text-[10px] text-stone-500 dark:text-stone-400">
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <span>☕</span>
                <span>BrewNest Table #{tableNumber || '04'}</span>
              </span>
              <span className="font-mono">LIVE</span>
            </div>

            {/* QR Canvas / Image */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center shadow-inner">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
                  <span className="text-[11px]">Generating QR...</span>
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code for Table ${tableNumber} BrewNest Digital Menu`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                  Generating...
                </div>
              )}

              {/* Watermark Logo in Center overlay */}
              {!isGenerating && qrDataUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1C0F08] border-2 border-amber-600/80 shadow-md flex items-center justify-center">
                    <span className="text-xs">☕</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt under QR */}
            <div className="mt-3 text-center space-y-0.5">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 dark:text-stone-100">
                <Smartphone className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Scan with phone camera</span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Opens instant contactless menu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
