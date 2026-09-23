import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Crown,
  Coffee,
  Flame,
  Sparkles,
  Gift,
  Tag,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  Clock,
  Compass,
  History,
  Star,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  CheckCircle2,
  ShoppingBag,
  Calendar,
  Search,
  Receipt,
  Filter,
  Loader2,
} from 'lucide-react';
import {
  REWARD_TIERS,
  DIGITAL_BADGES_CATALOG,
  DISCOUNT_REWARDS_CATALOG,
  DigitalBadgeDef,
  DiscountRewardDef,
} from '../data/rewardsData';
import {
  RewardsProfile,
  PastOrder,
  PastOrderItem,
  loadRewardsProfile,
  saveRewardsProfile,
  loadPastOrders,
  fetchPastOrders,
  redeemRewardCoupon,
  claimDailyBonus,
  resetRewardsToDefault,
  awardPointsForOrder,
  getTierForPoints,
} from '../utils/rewardsStorage';

interface BrewNestRewardsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCouponToTray?: (code: string) => void;
  onOpenTray?: () => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  onReorderPastOrder?: (items: { name: string; count: number; unitPrice: number; selectedSize?: string; selectedMilk?: string }[]) => void;
}

export const BrewNestRewardsDashboard: React.FC<BrewNestRewardsDashboardProps> = ({
  isOpen,
  onClose,
  onApplyCouponToTray,
  onOpenTray,
  onShowToast,
  onReorderPastOrder,
}) => {
  const [profile, setProfile] = useState<RewardsProfile>(loadRewardsProfile());
  const [orders, setOrders] = useState<PastOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'Dine-In' | 'Takeaway'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [copiedReceiptId, setCopiedReceiptId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'rewards' | 'orders' | 'badges' | 'history' | 'tiers'>('rewards');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [checkinLoading, setCheckinLoading] = useState(false);

  // Fetch past orders asynchronously
  const loadOrdersData = async () => {
    setIsLoadingOrders(true);
    try {
      const fetched = await fetchPastOrders();
      setOrders(fetched);
    } catch (e) {
      console.error('Error fetching past orders', e);
      setOrders(loadPastOrders());
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Sync profile & fetch orders when opened or when storage updates
  useEffect(() => {
    if (isOpen) {
      setProfile(loadRewardsProfile());
      loadOrdersData();
    }

    const handleUpdate = () => {
      setProfile(loadRewardsProfile());
    };

    const handleOrdersUpdate = () => {
      loadOrdersData();
    };

    window.addEventListener('brewnest_rewards_updated', handleUpdate);
    window.addEventListener('brewnest_orders_updated', handleOrdersUpdate);
    return () => {
      window.removeEventListener('brewnest_rewards_updated', handleUpdate);
      window.removeEventListener('brewnest_orders_updated', handleOrdersUpdate);
    };
  }, [isOpen]);

  // Handle ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTier = getTierForPoints(profile.lifetimePoints);
  const nextTierIndex = REWARD_TIERS.findIndex((t) => t.name === currentTier.name) + 1;
  const nextTier = nextTierIndex < REWARD_TIERS.length ? REWARD_TIERS[nextTierIndex] : null;

  // Calculate percentage toward next tier
  const pointsToNext = nextTier ? Math.max(0, nextTier.minPoints - profile.lifetimePoints) : 0;
  const tierProgressPercent = nextTier
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((profile.lifetimePoints - currentTier.minPoints) /
              (nextTier.minPoints - currentTier.minPoints)) *
              100
          )
        )
      )
    : 100;

  // Copy promo code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onShowToast?.(`Coupon "${code}" Copied!`, 'Paste or apply directly in your Order Tray.', 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Redeem discount reward
  const handleRedeem = (reward: DiscountRewardDef) => {
    const result = redeemRewardCoupon(reward);
    if (result.success) {
      setProfile(loadRewardsProfile());
      onShowToast?.(
        `Reward Unlocked: ${reward.title}`,
        `Use code ${reward.promoCode} in your order tray.`,
        'success'
      );
    } else {
      onShowToast?.('Insufficient Points', result.message, 'error');
    }
  };

  // Daily Checkin
  const handleCheckin = () => {
    setCheckinLoading(true);
    setTimeout(() => {
      const res = claimDailyBonus();
      setCheckinLoading(false);
      if (res.success) {
        setProfile(loadRewardsProfile());
        onShowToast?.('☕ Daily Brew Check-In!', res.message, 'success');
      } else {
        onShowToast?.('Already Claimed', res.message, 'info');
      }
    }, 400);
  };

  // Simulate quick test order (+35 pts)
  const handleSimulateOrder = () => {
    const sampleItems = [
      {
        name: 'Hazelnut Cold Foam Cold Brew',
        count: 1,
        unitPrice: 220,
        isSignature: true,
        category: 'Coffee',
        selectedSize: 'Regular',
      },
      {
        name: 'Artisan Butter Croissant',
        count: 1,
        unitPrice: 130,
        category: 'Snacks',
      },
    ];
    const res = awardPointsForOrder(350, sampleItems, {
      fulfillmentType: 'Dine-In',
      tableNumber: 'Table #07',
    });
    setProfile(res.updatedProfile);
    loadOrdersData();
    onShowToast?.(
      `Order Tested: +${res.earnedPoints} Points Earned!`,
      `Order ${res.createdOrder.orderNumber} added to Order History. Total: ₹${res.createdOrder.totalAmount}.`,
      'success'
    );
  };

  // Reset demo
  const handleReset = () => {
    const reset = resetRewardsToDefault();
    setProfile(reset);
    loadOrdersData();
    onShowToast?.('Rewards & Orders Reset', 'Demo profile and past orders restored to starting state.', 'info');
  };

  // Copy full itemized receipt for an order
  const handleCopyOrderReceipt = (order: PastOrder) => {
    const lines = [
      `=== BREWNEST CAFÉ ORDER RECEIPT ===`,
      `Order #: ${order.orderNumber}`,
      `Date: ${order.date}`,
      `Fulfillment: ${order.fulfillmentType} ${order.tableNumber ? `(${order.tableNumber})` : ''}`,
      `Status: ${order.status}`,
      `---------------------------------`,
      `ITEMS:`,
      ...order.items.map(
        (it) =>
          `- ${it.name} x${it.count} @ ₹${it.unitPrice} = ₹${it.unitPrice * it.count}` +
          (it.selectedSize ? ` (${it.selectedSize})` : '') +
          (it.selectedMilk ? ` [${it.selectedMilk}]` : '')
      ),
      `---------------------------------`,
      `Subtotal: ₹${order.subtotal}`,
      order.discountAmount
        ? `Discount (${order.discountLabel || 'Coupon'}): -₹${order.discountAmount}`
        : null,
      `GST (5% Restaurant Tax): ₹${order.gstAmount}`,
      `TOTAL AMOUNT: ₹${order.totalAmount}`,
      `Loyalty Points Earned: +${order.pointsEarned} pts`,
      `=================================`,
      `BrewNest Café · Greater Noida · Visit again soon!`,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedReceiptId(order.id);
    onShowToast?.(`Receipt Copied!`, `Receipt for Order #${order.orderNumber} copied to clipboard.`, 'success');
    setTimeout(() => setCopiedReceiptId(null), 2500);
  };

  // Reorder items
  const handleReorder = (order: PastOrder) => {
    if (onReorderPastOrder) {
      onReorderPastOrder(order.items);
    } else if (onOpenTray) {
      onOpenTray();
    }
  };

  // Filtered orders list based on search and fulfillment filter
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      orderFilter === 'all' || order.fulfillmentType.toLowerCase().includes(orderFilter.toLowerCase());

    const matchesSearch =
      orderSearch.trim() === '' ||
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.items.some((i) => i.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      order.date.toLowerCase().includes(orderSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-300" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Star className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FAF7F2] dark:bg-[#120A06] rounded-2xl shadow-2xl border border-stone-300/80 dark:border-amber-950/60 overflow-hidden text-stone-800 dark:text-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rewards-dashboard-title"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 bg-white dark:bg-[#190F09] border-b border-stone-200/80 dark:border-amber-950/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B1810] dark:bg-amber-500/20 text-amber-200 dark:text-amber-400 flex items-center justify-center shadow-xs border border-transparent dark:border-amber-500/30">
              <Crown className="w-5 h-5 text-amber-300 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="rewards-dashboard-title" className="font-serif text-lg sm:text-xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                  BrewNest Rewards Club
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50">
                  {currentTier.name}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Earn 1 pt per ₹10 on every order · Unlock digital badges &amp; exclusive cafe perks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-[#20140D] transition-colors"
              title="Reset profile data to demo default"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-[#24160E] transition-colors cursor-pointer"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Member Card & Tier Progress (Luxury Coffee Club Card) */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2B1810] via-[#3A2216] to-[#1E110A] text-white p-5 sm:p-6 shadow-xl border border-amber-900/40">
            {/* Background Coffee Art Vector Accents */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-end pr-4">
              <Coffee className="w-64 h-64 text-amber-200" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Member Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                      BrewNest Roastery Member
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-black/40 text-amber-200/90 font-mono">
                      {profile.memberId}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#F7EAE1]">
                    {profile.customerName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-amber-200/80">
                    <span className="inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      {profile.streakDays}-Day Visit Streak
                    </span>
                    <span>•</span>
                    <span>{profile.ordersCount} Completed Orders</span>
                    <span>•</span>
                    <span>{profile.lifetimePoints} Lifetime Points</span>
                  </div>
                </div>

                {/* Points Balance Big Badge & Daily Checkin */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 bg-black/25 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase tracking-wider text-amber-300/80">
                      Available Points
                    </div>
                    <div className="text-3xl sm:text-4xl font-serif font-black text-amber-200 tracking-tight flex items-baseline gap-1 sm:justify-end">
                      {profile.pointsBalance}
                      <span className="text-sm font-sans font-medium text-amber-300/90">pts</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckin}
                    disabled={checkinLoading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2B1810] bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#2B1810]" />
                    <span>Daily Check-in (+15 pts)</span>
                  </button>
                </div>
              </div>

              {/* Tier Progress Bar */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-100">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Current Tier: <strong className="text-amber-300 font-bold">{currentTier.name}</strong></span>
                  </div>
                  {nextTier ? (
                    <span className="text-[11px] text-amber-200/90">
                      {pointsToNext} pts to <strong>{nextTier.name}</strong>
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-300 font-semibold">
                      Max Platinum Tier Unlocked! 🏆
                    </span>
                  )}
                </div>

                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-200 rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${tierProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Simulator Bar */}
          <div className="p-3 bg-amber-50/70 dark:bg-[#1B110A] border border-amber-200/80 dark:border-amber-900/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
              <PlusCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>
                Want to test real-time rewards accumulation? Simulate an order inquiry to earn live points!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateOrder}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-white bg-[#2B1810] dark:bg-amber-600 hover:bg-[#1D100A] dark:hover:bg-amber-700 transition-colors shadow-2xs cursor-pointer"
              >
                <span>+ Simulate Order (+38 pts)</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-stone-200 dark:border-amber-950/60 pb-1 overflow-x-auto text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('rewards')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'rewards'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1A100A]'
              }`}
            >
              <Gift className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Discount Rewards ({DISCOUNT_REWARDS_CATALOG.length})</span>
            </button>

            <button
              id="rewards-tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1A100A]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Order History ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('badges')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'badges'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1A100A]'
              }`}
            >
              <Award className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Digital Badges ({profile.unlockedBadgeIds.length}/{DIGITAL_BADGES_CATALOG.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1A100A]'
              }`}
            >
              <History className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Points History ({profile.history.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tiers')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'tiers'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1A100A]'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Tier Perks</span>
            </button>
          </div>

          {/* TAB 1: DISCOUNT REWARDS CATALOG */}
          {activeTab === 'rewards' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                <span>
                  Redeem your points balance for instant discount promo codes applicable directly in your Order Tray.
                </span>
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  Balance: <strong className="text-amber-700 dark:text-amber-400">{profile.pointsBalance} pts</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {DISCOUNT_REWARDS_CATALOG.map((reward) => {
                  const isRedeemed = profile.redeemedCouponCodes.includes(reward.promoCode);
                  const canAfford = profile.pointsBalance >= reward.pointsCost;

                  return (
                    <div
                      key={reward.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isRedeemed
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/50'
                          : canAfford
                          ? 'bg-white dark:bg-[#180E08] border-stone-200 dark:border-amber-950/60 shadow-xs hover:border-amber-300 dark:hover:border-amber-800'
                          : 'bg-white/60 dark:bg-[#150C07] border-stone-200/60 dark:border-stone-800/40 opacity-80'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 mb-1">
                              {reward.badgeTag}
                            </span>
                            <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                              {reward.title}
                            </h4>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 font-bold text-sm text-amber-800 dark:text-amber-400">
                              <Sparkles className="w-3.5 h-3.5" />
                              {reward.pointsCost} pts
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                          {reward.description}
                        </p>

                        <div className="text-[11px] text-stone-400 dark:text-stone-500 italic">
                          {reward.terms}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-amber-950/40 flex items-center justify-between gap-2">
                        {isRedeemed ? (
                          <div className="w-full flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-mono bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800/40">
                                {reward.promoCode}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCopyCode(reward.promoCode)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-[#251710] hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
                                title="Copy code"
                              >
                                {copiedCode === reward.promoCode ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>

                              {onApplyCouponToTray && (
                                <button
                                  onClick={() => {
                                    onApplyCouponToTray(reward.promoCode);
                                    onClose();
                                    onOpenTray?.();
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors shadow-2xs cursor-pointer"
                                >
                                  <span>Apply in Tray</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-2">
                            <span className="text-[11px] text-stone-500">
                              {canAfford
                                ? 'Ready to claim'
                                : `Need ${reward.pointsCost - profile.pointsBalance} more pts`}
                            </span>

                            <button
                              onClick={() => handleRedeem(reward)}
                              disabled={!canAfford}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                                canAfford
                                  ? 'text-white bg-[#2B1810] dark:bg-amber-600 hover:bg-[#1D100A] dark:hover:bg-amber-700 cursor-pointer'
                                  : 'text-stone-400 bg-stone-200 dark:bg-stone-800/80 cursor-not-allowed opacity-75'
                              }`}
                            >
                              <Gift className="w-3.5 h-3.5" />
                              <span>Redeem Reward</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY (FETCHED PAST ORDERS) */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Controls bar: search, filter chips, refresh */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#180E08] p-3 rounded-xl border border-stone-200/90 dark:border-amber-950/60">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search past orders by #, items, date..."
                    className="w-full pl-9 pr-8 py-1.5 text-xs bg-stone-50 dark:bg-[#140C07] border border-stone-200 dark:border-amber-950/60 rounded-lg text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-stone-100 dark:bg-[#140C07] p-0.5 rounded-lg border border-stone-200 dark:border-amber-950/60 text-xs">
                    {(['all', 'Dine-In', 'Takeaway'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderFilter(type)}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                          orderFilter === type
                            ? 'bg-white dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-bold shadow-2xs'
                            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                        }`}
                      >
                        {type === 'all' ? 'All Orders' : type}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={loadOrdersData}
                    disabled={isLoadingOrders}
                    title="Refresh past orders"
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-amber-950/60 bg-stone-50 dark:bg-[#140C07] text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-300 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin text-amber-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingOrders ? (
                <div className="p-10 bg-white dark:bg-[#180E08] rounded-2xl border border-stone-200/90 dark:border-amber-950/60 text-center space-y-3">
                  <Loader2 className="w-6 h-6 text-amber-600 animate-spin mx-auto" />
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
                    Fetching your past café order records from BrewNest...
                  </p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-[#180E08] rounded-2xl border border-stone-200 dark:border-amber-950/60 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      No Past Orders Found
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                      {orderSearch || orderFilter !== 'all'
                        ? 'No orders match your current search or filter criteria. Try resetting the filters.'
                        : 'You haven’t completed any café orders yet. Place an order from our menu to earn loyalty points and view your order history here.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {orderSearch || orderFilter !== 'all' ? (
                      <button
                        onClick={() => {
                          setOrderSearch('');
                          setOrderFilter('all');
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenTray?.();
                        }}
                        className="px-4 py-2 text-xs font-bold text-white bg-[#2B1810] dark:bg-amber-600 rounded-lg hover:bg-[#1D100A] transition-colors shadow-xs cursor-pointer"
                      >
                        Explore Menu & Order
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredOrders.map((order) => {
                    const totalItemsCount = order.items.reduce((sum, it) => sum + it.count, 0);

                    return (
                      <div
                        key={order.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#180E08] border border-stone-200/90 dark:border-amber-950/60 shadow-xs hover:border-amber-400/60 transition-all space-y-4"
                      >
                        {/* Order Header: Order #, Date, Status, Fulfillment, Points */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-stone-100 dark:border-amber-950/40 text-xs">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">
                              #{order.orderNumber}
                            </span>
                            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span className="font-medium">{order.date}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                              <CheckCircle2 className="w-3 h-3" />
                              {order.status}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-[#20130B] text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-amber-950/60">
                              {order.fulfillmentType} {order.tableNumber ? `· ${order.tableNumber}` : ''}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100/80 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/50">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              +{order.pointsEarned} pts
                            </span>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                            Ordered Items ({totalItemsCount})
                          </div>
                          <div className="divide-y divide-stone-100 dark:divide-amber-950/30 bg-stone-50/60 dark:bg-[#140C07] rounded-xl p-3 border border-stone-200/60 dark:border-amber-950/40">
                            {order.items.map((it, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center justify-between gap-3 text-xs py-1.5 ${
                                  idx === 0 ? 'pt-0' : ''
                                } ${idx === order.items.length - 1 ? 'pb-0' : ''}`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                                    {it.count}x
                                  </span>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                                      {it.name}
                                    </div>
                                    <div className="text-[11px] text-stone-400 flex items-center gap-1.5 flex-wrap">
                                      {it.selectedSize && <span>{it.selectedSize}</span>}
                                      {it.selectedMilk && (
                                        <>
                                          <span>•</span>
                                          <span>{it.selectedMilk}</span>
                                        </>
                                      )}
                                      {it.category && (
                                        <>
                                          <span>•</span>
                                          <span className="text-amber-700/80 dark:text-amber-400/80">{it.category}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="font-medium text-stone-700 dark:text-stone-300 text-right shrink-0">
                                  ₹{it.unitPrice * it.count}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Financials & Total Amount */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs border-t border-stone-100 dark:border-amber-950/40">
                          {/* Subtotals breakdown */}
                          <div className="space-y-1 text-stone-500 dark:text-stone-400">
                            <div className="flex items-center gap-4">
                              <span>Subtotal:</span>
                              <span className="font-medium text-stone-700 dark:text-stone-300">₹{order.subtotal}</span>
                            </div>
                            {order.discountAmount ? (
                              <div className="flex items-center gap-4 text-emerald-700 dark:text-emerald-400">
                                <span>Discount ({order.discountLabel || 'Coupon'}):</span>
                                <span className="font-semibold">-₹{order.discountAmount}</span>
                              </div>
                            ) : null}
                            <div className="flex items-center gap-4">
                              <span>GST (5%):</span>
                              <span className="font-medium text-stone-700 dark:text-stone-300">₹{order.gstAmount}</span>
                            </div>
                          </div>

                          {/* Total Amount & Action buttons */}
                          <div className="flex flex-col sm:items-end gap-2.5">
                            <div className="flex items-baseline gap-2 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40">
                              <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                                Total Amount:
                              </span>
                              <span className="font-serif text-base font-bold text-amber-900 dark:text-amber-300">
                                ₹ {order.totalAmount}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyOrderReceipt(order)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-[#1F130B] hover:bg-stone-200 transition-colors cursor-pointer"
                              >
                                {copiedReceiptId === order.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-stone-400" />
                                    <span>Copy Receipt</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleReorder(order)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#2B1810] dark:bg-amber-600 hover:bg-[#1D100A] dark:hover:bg-amber-700 transition-colors shadow-2xs cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5 text-amber-200" />
                                <span>Reorder to Tray</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DIGITAL BADGES CATALOG */}
          {activeTab === 'badges' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Unlock commemorative digital barista badges by ordering specialty brews, keeping up your café routine, and tasting our seasonal catalog.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {DIGITAL_BADGES_CATALOG.map((badge) => {
                  const isUnlocked = profile.unlockedBadgeIds.includes(badge.id);

                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isUnlocked
                          ? 'bg-white dark:bg-[#180E08] border-amber-300/80 dark:border-amber-800/60 shadow-xs'
                          : 'bg-stone-50/70 dark:bg-[#140C07] border-stone-200 dark:border-stone-800/50 opacity-65'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                              isUnlocked
                                ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800/60'
                                : 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700'
                            }`}
                          >
                            {getBadgeIcon(badge.iconName)}
                          </div>

                          {isUnlocked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800/40">
                              <Check className="w-3 h-3" />
                              Unlocked
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500">
                              Locked
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                            {badge.category}
                          </div>
                          <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                            {badge.name}
                          </h4>
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-amber-950/40 text-[11px] text-stone-400 dark:text-stone-500">
                        Goal: <strong className="text-stone-600 dark:text-stone-300">{badge.thresholdText}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: POINTS & ORDER LOG */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-between">
                <span>Detailed audit log of points earned through café orders and check-ins.</span>
                <span>{profile.history.length} transactions</span>
              </div>

              {profile.history.length === 0 ? (
                <div className="text-center p-8 bg-white dark:bg-[#180E08] rounded-xl border border-stone-200 dark:border-amber-950/60 text-stone-400 text-xs">
                  No points activity recorded yet. Place an order or check in to start tracking!
                </div>
              ) : (
                <div className="divide-y divide-stone-200/80 dark:divide-amber-950/40 bg-white dark:bg-[#180E08] rounded-xl border border-stone-200 dark:border-amber-950/60 overflow-hidden">
                  {profile.history.map((log) => {
                    const isPositive = log.pointsDelta > 0;
                    return (
                      <div key={log.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isPositive
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            {isPositive ? <PlusCircle className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                          </div>

                          <div className="min-w-0">
                            <div className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                              {log.title}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5 truncate">
                              <span className="font-mono">{log.orderNumber}</span>
                              <span>•</span>
                              <span>{log.details}</span>
                              <span>•</span>
                              <span className="text-stone-400">{log.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`font-serif text-sm font-bold ${
                              isPositive
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-stone-500 dark:text-stone-400'
                            }`}
                          >
                            {isPositive ? `+${log.pointsDelta}` : log.pointsDelta} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TIER PERKS COMPARISON */}
          {activeTab === 'tiers' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Level up your membership by collecting lifetime points on every artisanal coffee, snack, and meal at BrewNest.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {REWARD_TIERS.map((tier) => {
                  const isCurrent = tier.name === currentTier.name;
                  return (
                    <div
                      key={tier.name}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isCurrent
                          ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-400 dark:border-amber-700 shadow-sm ring-1 ring-amber-400/50'
                          : 'bg-white dark:bg-[#180E08] border-stone-200 dark:border-amber-950/60'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold uppercase tracking-wider ${tier.color}`}>
                            {tier.name}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded">
                              Active Tier
                            </span>
                          )}
                        </div>

                        <div className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                          {tier.minPoints} – {tier.maxPoints > 10000 ? '1,000+' : tier.maxPoints} pts
                        </div>

                        <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-amber-950/40">
                          {tier.perks.map((perk, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <Check className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 dark:bg-[#160D07] border-t border-stone-200/80 dark:border-amber-950/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
            <Coffee className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400" />
            <span>
              Orders placed in the Interactive Tray automatically accrue points at checkout inquiry.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg font-semibold text-stone-700 dark:text-stone-300 bg-stone-200 dark:bg-[#251710] hover:bg-stone-300 dark:hover:bg-[#2E1D14] transition-colors cursor-pointer"
            >
              Close
            </button>
            {onOpenTray && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTray();
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold text-white bg-[#2B1810] dark:bg-amber-600 hover:bg-[#1D100A] dark:hover:bg-amber-700 transition-colors shadow-2xs cursor-pointer"
              >
                <span>View Order Tray</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
