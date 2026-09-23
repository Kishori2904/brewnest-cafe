import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  CalendarCheck,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  Copy,
  AlertCircle,
  Percent,
  Sparkles,
  Gift,
  Award,
  CheckCircle,
} from 'lucide-react';
import { TrayItem } from '../types';
import { awardPointsForOrder, loadRewardsProfile } from '../utils/rewardsStorage';

interface OrderTrayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trayItems: TrayItem[];
  onUpdateCount: (trayId: string, delta: number) => void;
  onRemoveItem: (trayId: string) => void;
  onClearTray: () => void;
  onProceedToInquiry: () => void;
  onCopyTraySummary: () => void;
  onOpenRewards?: () => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  initialPromoCode?: string;
}

interface AppliedDiscount {
  code: string;
  type: 'percent' | 'flat';
  amount: number;
  label: string;
}

export const OrderTrayDrawer: React.FC<OrderTrayDrawerProps> = ({
  isOpen,
  onClose,
  trayItems,
  onUpdateCount,
  onRemoveItem,
  onClearTray,
  onProceedToInquiry,
  onCopyTraySummary,
  onOpenRewards,
  onShowToast,
  initialPromoCode,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<AppliedDiscount | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [orderCompletedSuccess, setOrderCompletedSuccess] = useState<{
    pointsEarned: number;
    orderNumber: string;
    total: number;
  } | null>(null);

  // Auto-apply if passed from rewards dashboard
  useEffect(() => {
    if (initialPromoCode) {
      applyCode(initialPromoCode);
    }
  }, [initialPromoCode]);

  if (!isOpen) return null;

  // Subtotal from unitPrice * count
  const rawSubtotal = trayItems.reduce((sum, entry) => sum + entry.unitPrice * entry.count, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round((rawSubtotal * appliedPromo.amount) / 100);
    } else {
      discountAmount = Math.min(rawSubtotal, appliedPromo.amount);
    }
  }

  const taxableAmount = Math.max(0, rawSubtotal - discountAmount);

  // 5% GST standard for restaurant services
  const gstAmount = Math.round(taxableAmount * 0.05);
  const finalTotal = taxableAmount + gstAmount;

  // Estimated points customer will earn on this order
  const profile = loadRewardsProfile();
  let multiplier = 1.0;
  if (profile.currentTierName === 'Silver Roast') multiplier = 1.2;
  if (profile.currentTierName === 'Gold Barista Club') multiplier = 1.5;
  if (profile.currentTierName === 'Platinum Master') multiplier = 2.0;

  const hasSignature = trayItems.some((t) => t.item.isSignature);
  const estimatedPoints = Math.max(
    10,
    Math.round((finalTotal / 10) * multiplier) + (hasSignature ? 15 : 0)
  );

  const applyCode = (rawCode: string) => {
    const clean = rawCode.trim().toUpperCase();
    if (clean === 'BREW50') {
      if (rawSubtotal < 150) {
        setPromoError('BREW50 requires a minimum order subtotal of ₹150.');
        return;
      }
      setAppliedPromo({ code: clean, type: 'flat', amount: 50, label: '₹50 Off Reward Coupon' });
      setPromoError(null);
    } else if (clean === 'FREEBAKE') {
      setAppliedPromo({ code: clean, type: 'flat', amount: 130, label: 'Free Bakery Reward (Up to ₹130)' });
      setPromoError(null);
    } else if (clean === 'SIGFREE') {
      setAppliedPromo({ code: clean, type: 'flat', amount: 220, label: 'Free Signature Brew Reward (Up to ₹220)' });
      setPromoError(null);
    } else if (clean === 'VIP20') {
      setAppliedPromo({ code: clean, type: 'percent', amount: 20, label: '20% VIP Reward Discount' });
      setPromoError(null);
    } else if (clean === 'STUDENT15' || clean === 'GREATERNOIDA') {
      setAppliedPromo({ code: clean, type: 'percent', amount: 15, label: 'Student 15% Discount' });
      setPromoError(null);
    } else if (clean === 'BREW10' || clean === 'WELCOME10') {
      setAppliedPromo({ code: clean, type: 'percent', amount: 10, label: 'Welcome 10% Discount' });
      setPromoError(null);
    } else {
      setPromoError('Invalid code. Try "BREW50", "VIP20", "STUDENT15", or redeem points in Rewards!');
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    applyCode(promoCode);
  };

  // Complete Order & Award Points
  const handleCheckoutAndEarnPoints = () => {
    const orderItems = trayItems.map((t) => ({
      name: t.item.name,
      count: t.count,
      unitPrice: t.unitPrice,
      isSignature: t.item.isSignature,
      category: t.item.category,
      selectedSize: t.selectedSize,
      selectedMilk: t.selectedMilk,
    }));

    const result = awardPointsForOrder(finalTotal, orderItems, {
      discountAmount,
      discountLabel: appliedPromo ? `${appliedPromo.code} (${appliedPromo.label})` : undefined,
      fulfillmentType: 'Dine-In',
      tableNumber: 'Table #04',
    });

    setOrderCompletedSuccess({
      pointsEarned: result.earnedPoints,
      orderNumber: result.createdOrder.orderNumber,
      total: finalTotal,
    });

    onShowToast?.(
      `🎉 +${result.earnedPoints} BrewNest Points Earned!`,
      `Order ${result.createdOrder.orderNumber} confirmed. Total points: ${result.newBalance} pts.`,
      'success'
    );
  };

  const handleCopyReceipt = () => {
    const lines = [
      `=== BREWNEST CAFÉ GREATER NOIDA ===`,
      `Inquiry Tray Estimate`,
      `---------------------------------`,
      ...trayItems.map(
        (t) =>
          `- ${t.item.name} x${t.count} @ ₹${t.unitPrice} each = ₹${t.unitPrice * t.count}` +
          (t.selectedSize ? ` (${t.selectedSize})` : '') +
          (t.selectedMilk ? ` [${t.selectedMilk}]` : '')
      ),
      `---------------------------------`,
      `Subtotal: ₹${rawSubtotal}`,
      appliedPromo
        ? `Discount (${appliedPromo.code}): -₹${discountAmount} [${appliedPromo.label}]`
        : null,
      `GST (5% Restaurant Tax): ₹${gstAmount}`,
      `Estimated Total: ₹${finalTotal}`,
      `Points to be Earned: +${estimatedPoints} pts`,
      `=================================`,
      `Note: Demo pricing estimate for table reservation or takeaway.`,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#120A06] h-full shadow-2xl flex flex-col border-l border-stone-300 dark:border-amber-950/60 animate-in slide-in-from-right duration-250 transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tray-drawer-title"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#190F09] border-b border-stone-200 dark:border-amber-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-900 dark:text-amber-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="tray-drawer-title" className="font-serif text-lg font-bold text-stone-900 dark:text-[#F7EAE1]">
                Interactive Order Tray
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Review selections &amp; calculate estimated cost
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-[#2A1B12] transition-colors cursor-pointer"
            aria-label="Close tray"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Items list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {trayItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-[#1C100A] border border-amber-200 dark:border-amber-900/40 flex items-center justify-center text-amber-800 dark:text-amber-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-800 dark:text-stone-200">
                Your Tray is Empty
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
                Explore our 7 menu categories or try our interactive mood recommendation to add coffees, paninis, and treats to your tray.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 text-xs font-semibold text-white bg-[#331C12] hover:bg-[#201109] dark:bg-amber-600 dark:hover:bg-amber-700 dark:text-stone-950 rounded-xl cursor-pointer"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <>
              {/* Header stats & clear */}
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pb-2 border-b border-stone-200 dark:border-amber-950/40">
                <span>
                  <strong className="text-stone-800 dark:text-stone-200">{trayItems.length}</strong> unique offering{trayItems.length > 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyReceipt}
                    className="text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy text breakdown"
                  >
                    {copiedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReceipt ? 'Copied!' : 'Copy Summary'}</span>
                  </button>

                  <button
                    onClick={onClearTray}
                    className="text-stone-500 hover:text-rose-700 dark:text-stone-400 dark:hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              {/* Items */}
              {trayItems.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-white dark:bg-[#190F09] rounded-2xl border border-stone-200 dark:border-amber-950/50 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-stone-900 overflow-hidden shrink-0">
                      <img
                        src={entry.item.image}
                        alt={entry.item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {entry.item.name}
                      </h4>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        ₹{entry.unitPrice} each · <span className="font-bold text-amber-950 dark:text-amber-400 font-serif">₹{entry.unitPrice * entry.count}</span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onUpdateCount(entry.id, -1)}
                        className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-[#2A1B12] dark:hover:bg-[#382317] text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-stone-800 dark:text-stone-100 font-mono">
                        {entry.count}
                      </span>
                      <button
                        onClick={() => onUpdateCount(entry.id, 1)}
                        className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-[#2A1B12] dark:hover:bg-[#382317] text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center justify-center cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemoveItem(entry.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 ml-1 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Customization Badges if selected */}
                  {(entry.selectedSize || entry.selectedMilk || (entry.selectedExtras && entry.selectedExtras.length > 0)) && (
                    <div className="flex flex-wrap gap-1 text-[10px] text-stone-600 dark:text-stone-300 pt-1 border-t border-stone-100 dark:border-amber-950/30">
                      {entry.selectedSize && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 font-medium">
                          Size: {entry.selectedSize}
                        </span>
                      )}
                      {entry.selectedMilk && (
                        <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#251710] text-stone-700 dark:text-stone-300 font-medium">
                          {entry.selectedMilk}
                        </span>
                      )}
                      {entry.selectedExtras && entry.selectedExtras.map((ex) => (
                        <span key={ex} className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-medium">
                          +{ex.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* BrewNest Rewards Loyalty Perks Banner */}
              <div className="p-3.5 bg-gradient-to-r from-amber-900/10 via-amber-800/10 to-amber-700/10 dark:from-amber-950/40 dark:to-amber-900/20 rounded-2xl border border-amber-300/80 dark:border-amber-800/50 shadow-2xs flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-900 dark:text-amber-300 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                      <span>Earn ~{estimatedPoints} Rewards Points</span>
                      <Sparkles className="w-3 h-3 text-amber-500" />
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">
                      Tier: {profile.currentTierName} ({multiplier}x multiplier)
                    </div>
                  </div>
                </div>

                {onOpenRewards && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRewards();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-amber-950 dark:text-amber-200 bg-amber-200/80 dark:bg-amber-800/60 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Gift className="w-3 h-3" />
                    <span>Redeem</span>
                  </button>
                )}
              </div>

              {/* Promo Code Input Simulator */}
              <div className="p-3.5 bg-white dark:bg-[#190F09] rounded-2xl border border-stone-200 dark:border-amber-950/50 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    <span>Loyalty / Promo Code</span>
                  </span>
                  <span className="text-[10px] text-stone-400">Try "BREW50" or "STUDENT15"</span>
                </div>

                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code (e.g. BREW50)"
                    className="flex-1 px-3 py-1.5 text-xs uppercase bg-stone-50 dark:bg-[#120A06] border border-stone-200 dark:border-amber-950/50 text-stone-900 dark:text-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold text-white dark:text-stone-950 bg-stone-800 hover:bg-stone-900 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-xl cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      <span>
                        <strong>{appliedPromo.code}</strong> applied: {appliedPromo.label} (-₹{discountAmount})
                      </span>
                    </div>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 underline text-[10px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-[10px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{promoError}</span>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Order Completed Celebratory State */}
        {orderCompletedSuccess && (
          <div className="p-5 bg-emerald-50/90 dark:bg-emerald-950/40 border-t border-emerald-300 dark:border-emerald-800/50 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-sm text-emerald-950 dark:text-emerald-200">
                  Order Confirmed · {orderCompletedSuccess.orderNumber}
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  You earned <strong className="font-bold">+{orderCompletedSuccess.pointsEarned} BrewNest Points</strong> on this ₹{orderCompletedSuccess.total} order!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  onClearTray();
                  setOrderCompletedSuccess(null);
                  onClose();
                  onOpenRewards?.();
                }}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer text-center"
              >
                View Updated Rewards Dashboard
              </button>
              <button
                onClick={() => {
                  onClearTray();
                  setOrderCompletedSuccess(null);
                  onClose();
                }}
                className="px-3 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-[#1E1109] border border-stone-200 dark:border-stone-800 rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Drawer Footer with Detailed Calculations */}
        {trayItems.length > 0 && !orderCompletedSuccess && (
          <div className="p-4 sm:p-5 bg-white dark:bg-[#190F09] border-t border-stone-200 dark:border-amber-950/50 space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal ({trayItems.length} items):</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">₹{rawSubtotal}</span>
              </div>

              {appliedPromo && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>{appliedPromo.label}:</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                <span>GST (5% Restaurant Hospitality Tax):</span>
                <span>₹{gstAmount}</span>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-amber-950/30 flex justify-between items-baseline">
                <div>
                  <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">Estimated Total:</span>
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    Points Earned: +{estimatedPoints} pts
                  </div>
                </div>
                <span className="font-serif text-2xl font-extrabold text-amber-950 dark:text-amber-400">₹{finalTotal}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {/* Primary action 1: Instant Order & Earn Points */}
              <button
                id="tray-complete-order-btn"
                onClick={handleCheckoutAndEarnPoints}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white dark:text-stone-950 bg-gradient-to-r from-[#2B1810] to-[#452719] hover:from-[#1D100A] hover:to-[#351E13] dark:from-amber-400 dark:to-amber-500 dark:hover:from-amber-300 dark:hover:to-amber-400 rounded-2xl shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 dark:text-stone-950" />
                <span>Confirm Order &amp; Earn +{estimatedPoints} Points</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Primary action 2: Transfer to Table Reservation Inquiry */}
              <button
                id="tray-transfer-to-reservation-btn"
                onClick={() => {
                  onProceedToInquiry();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-[#20140D] hover:bg-stone-200 dark:hover:bg-[#2A1B12] rounded-xl transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>Attach Items to Table Reservation Note</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-stone-400 dark:text-stone-500">
              Points are credited to your BrewNest Rewards card immediately upon confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );

};
