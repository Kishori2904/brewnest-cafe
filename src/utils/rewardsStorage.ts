import {
  REWARD_TIERS,
  DIGITAL_BADGES_CATALOG,
  DISCOUNT_REWARDS_CATALOG,
  RewardTierInfo,
  DiscountRewardDef,
} from '../data/rewardsData';

export interface OrderRewardLog {
  id: string;
  timestamp: string;
  orderNumber: string;
  title: string;
  details: string;
  pointsDelta: number; // +45 or -100
  type: 'order_earned' | 'reward_redeemed' | 'checkin_bonus' | 'tier_bonus';
}

export interface PastOrderItem {
  name: string;
  count: number;
  unitPrice: number;
  selectedSize?: string;
  selectedMilk?: string;
  category?: string;
}

export interface PastOrder {
  id: string;
  orderNumber: string;
  date: string; // e.g., "Sep 21, 2026 · 09:30 AM"
  timestampMs: number;
  items: PastOrderItem[];
  subtotal: number;
  discountAmount?: number;
  discountLabel?: string;
  gstAmount: number;
  totalAmount: number; // Final total amount paid
  pointsEarned: number;
  status: 'Completed' | 'Preparing' | 'Delivered' | 'Ready for Pickup';
  fulfillmentType: 'Dine-In' | 'Takeaway' | 'Table Reservation';
  tableNumber?: string;
}

export interface RewardsProfile {
  customerName: string;
  memberId: string;
  pointsBalance: number;
  lifetimePoints: number;
  ordersCount: number;
  streakDays: number;
  lastCheckinDate: string | null;
  currentTierName: RewardTierInfo['name'];
  unlockedBadgeIds: string[];
  redeemedCouponCodes: string[]; // Active or redeemed codes available to use
  history: OrderRewardLog[];
}

const STORAGE_KEY = 'brewnest_customer_rewards_profile_v1';
const ORDERS_STORAGE_KEY = 'brewnest_customer_past_orders_v1';

export const INITIAL_PAST_ORDERS: PastOrder[] = [
  {
    id: 'order-seed-1',
    orderNumber: 'BN-1082',
    date: 'Sep 21, 2026 at 09:30 AM',
    timestampMs: Date.now() - 86400000,
    items: [
      { name: 'Artisan Pour-Over', count: 1, unitPrice: 180, selectedSize: 'Regular', category: 'Coffee' },
      { name: 'Artisan Butter Croissant', count: 1, unitPrice: 130, category: 'Snacks' },
    ],
    subtotal: 310,
    gstAmount: 15,
    totalAmount: 325,
    pointsEarned: 38,
    status: 'Completed',
    fulfillmentType: 'Dine-In',
    tableNumber: 'Table #04',
  },
  {
    id: 'order-seed-2',
    orderNumber: 'BN-1055',
    date: 'Sep 18, 2026 at 10:15 AM',
    timestampMs: Date.now() - 86400000 * 3,
    items: [
      { name: 'Spanish Iced Latte', count: 1, unitPrice: 210, selectedSize: 'Large', selectedMilk: 'Oat Milk', category: 'Coffee' },
      { name: 'Classic Blueberry Muffin', count: 1, unitPrice: 140, category: 'Desserts' },
    ],
    subtotal: 350,
    gstAmount: 18,
    totalAmount: 368,
    pointsEarned: 45,
    status: 'Completed',
    fulfillmentType: 'Takeaway',
  },
  {
    id: 'order-seed-3',
    orderNumber: 'BN-1020',
    date: 'Sep 15, 2026 at 04:45 PM',
    timestampMs: Date.now() - 86400000 * 6,
    items: [
      { name: 'Hazelnut Cold Foam Cold Brew', count: 2, unitPrice: 220, selectedSize: 'Regular', category: 'Coffee' },
      { name: 'Truffle Mushroom Panini', count: 1, unitPrice: 260, category: 'Food' },
    ],
    subtotal: 700,
    discountAmount: 70,
    discountLabel: 'WELCOME10 (-10%)',
    gstAmount: 32,
    totalAmount: 662,
    pointsEarned: 84,
    status: 'Completed',
    fulfillmentType: 'Dine-In',
    tableNumber: 'Table #09',
  },
];

export const INITIAL_DEMO_PROFILE: RewardsProfile = {
  customerName: 'Aarav Sharma',
  memberId: 'BN-84920',
  pointsBalance: 240,
  lifetimePoints: 380,
  ordersCount: 3,
  streakDays: 2,
  lastCheckinDate: null,
  currentTierName: 'Silver Roast',
  unlockedBadgeIds: ['first_sip', 'morning_ritual'],
  redeemedCouponCodes: ['BREW50'],
  history: [
    {
      id: 'tx-seed-1',
      timestamp: 'Yesterday at 9:30 AM',
      orderNumber: 'BN-1082',
      title: 'Artisan Pour-Over & Butter Croissant',
      details: 'Table #04 · ₹325 total · 1.2x Silver tier multiplier',
      pointsDelta: +38,
      type: 'order_earned',
    },
    {
      id: 'tx-seed-2',
      timestamp: '3 days ago at 10:15 AM',
      orderNumber: 'BN-1055',
      title: 'Spanish Iced Latte & Blueberry Muffin',
      details: 'Takeaway · ₹368 total',
      pointsDelta: +45,
      type: 'order_earned',
    },
    {
      id: 'tx-seed-3',
      timestamp: '6 days ago',
      orderNumber: 'BN-1020',
      title: 'Hazelnut Cold Foam & Truffle Panini',
      details: 'Welcome order loyalty bonus · ₹662 total',
      pointsDelta: +84,
      type: 'order_earned',
    },
  ],
};

export const getTierForPoints = (lifetimePoints: number): RewardTierInfo => {
  if (lifetimePoints >= 1000) return REWARD_TIERS[3]; // Platinum
  if (lifetimePoints >= 500) return REWARD_TIERS[2];  // Gold
  if (lifetimePoints >= 200) return REWARD_TIERS[1];  // Silver
  return REWARD_TIERS[0]; // Bronze
};

export const loadRewardsProfile = (): RewardsProfile => {
  if (typeof window === 'undefined') return INITIAL_DEMO_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveRewardsProfile(INITIAL_DEMO_PROFILE);
      return INITIAL_DEMO_PROFILE;
    }
    const parsed = JSON.parse(raw) as RewardsProfile;
    // Ensure all catalog badges exist in structure
    if (!parsed.unlockedBadgeIds) parsed.unlockedBadgeIds = ['first_sip'];
    if (!parsed.redeemedCouponCodes) parsed.redeemedCouponCodes = [];
    if (!parsed.history) parsed.history = [];
    return parsed;
  } catch (e) {
    console.error('Failed to parse rewards profile from localStorage', e);
    return INITIAL_DEMO_PROFILE;
  }
};

export const saveRewardsProfile = (profile: RewardsProfile): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Trigger custom event so other components update synchronously
    window.dispatchEvent(new Event('brewnest_rewards_updated'));
  } catch (e) {
    console.error('Failed to save rewards profile to localStorage', e);
  }
};

export const loadPastOrders = (): PastOrder[] => {
  if (typeof window === 'undefined') return INITIAL_PAST_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      savePastOrders(INITIAL_PAST_ORDERS);
      return INITIAL_PAST_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PAST_ORDERS;
  } catch (e) {
    console.error('Failed to parse past orders from localStorage', e);
    return INITIAL_PAST_ORDERS;
  }
};

export const savePastOrders = (orders: PastOrder[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('brewnest_orders_updated'));
  } catch (e) {
    console.error('Failed to save past orders to localStorage', e);
  }
};

/**
 * Fetches past orders asynchronously with simulated network resolution
 */
export const fetchPastOrders = async (): Promise<PastOrder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loadPastOrders());
    }, 300);
  });
};

/**
 * Calculates and awards points for a completed order tray inquiry and logs the past order.
 */
export const awardPointsForOrder = (
  orderTotal: number,
  items: {
    name: string;
    count: number;
    unitPrice?: number;
    isSignature?: boolean;
    category?: string;
    selectedSize?: string;
    selectedMilk?: string;
  }[],
  meta?: {
    discountAmount?: number;
    discountLabel?: string;
    fulfillmentType?: 'Dine-In' | 'Takeaway' | 'Table Reservation';
    tableNumber?: string;
  }
): {
  earnedPoints: number;
  newBalance: number;
  newBadges: string[];
  updatedProfile: RewardsProfile;
  createdOrder: PastOrder;
} => {
  const current = loadRewardsProfile();
  const currentTier = getTierForPoints(current.lifetimePoints);

  // Multiplier based on tier
  let multiplier = 1.0;
  if (currentTier.name === 'Silver Roast') multiplier = 1.2;
  if (currentTier.name === 'Gold Barista Club') multiplier = 1.5;
  if (currentTier.name === 'Platinum Master') multiplier = 2.0;

  // Base: 1 pt per ₹10
  const basePoints = Math.max(10, Math.round((orderTotal / 10) * multiplier));

  // Bonus for signature drinks (+15)
  const hasSignature = items.some((i) => i.isSignature);
  const signatureBonus = hasSignature ? 15 : 0;

  // Total points earned
  const totalEarned = basePoints + signatureBonus;

  const newLifetime = current.lifetimePoints + totalEarned;
  const newBalance = current.pointsBalance + totalEarned;
  const newOrderCount = current.ordersCount + 1;
  const newTier = getTierForPoints(newLifetime);

  // Check Badge Unlocks
  const newlyUnlockedBadges: string[] = [];
  const updatedBadgeIds = [...current.unlockedBadgeIds];

  // 1. First Sip badge
  if (!updatedBadgeIds.includes('first_sip')) {
    updatedBadgeIds.push('first_sip');
    newlyUnlockedBadges.push('First Sip');
  }

  // 2. Signature drink connoisseur
  if (hasSignature && !updatedBadgeIds.includes('barista_connoisseur')) {
    updatedBadgeIds.push('barista_connoisseur');
    newlyUnlockedBadges.push('Artisan Connoisseur');
  }

  // 3. Flavour explorer (if item count >= 3)
  if (items.length >= 3 && !updatedBadgeIds.includes('flavour_explorer')) {
    updatedBadgeIds.push('flavour_explorer');
    newlyUnlockedBadges.push('Flavour Explorer');
  }

  // 4. Master patron (500+ lifetime)
  if (newLifetime >= 500 && !updatedBadgeIds.includes('master_patron')) {
    updatedBadgeIds.push('master_patron');
    newlyUnlockedBadges.push('Master Patron');
  }

  // Generate order transaction
  const orderId = `BN-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date();
  const timeStr = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const formattedFullDate = `${now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const itemsSummary = items
    .slice(0, 2)
    .map((i) => `${i.name} (x${i.count})`)
    .join(', ') + (items.length > 2 ? ` +${items.length - 2} more` : '');

  const newLog: OrderRewardLog = {
    id: `tx-${Date.now()}`,
    timestamp: timeStr,
    orderNumber: orderId,
    title: itemsSummary || 'Café Order Tray',
    details: `₹${orderTotal} total · ${multiplier}x multiplier ${signatureBonus > 0 ? '(+15 signature bonus)' : ''}`,
    pointsDelta: totalEarned,
    type: 'order_earned',
  };

  const updatedProfile: RewardsProfile = {
    ...current,
    pointsBalance: newBalance,
    lifetimePoints: newLifetime,
    ordersCount: newOrderCount,
    currentTierName: newTier.name,
    unlockedBadgeIds: updatedBadgeIds,
    history: [newLog, ...current.history],
  };

  saveRewardsProfile(updatedProfile);

  // Generate and save PastOrder record
  const calculatedSubtotal = items.reduce((sum, it) => sum + (it.unitPrice || 0) * it.count, 0) || orderTotal;
  const createdOrder: PastOrder = {
    id: `order-${Date.now()}`,
    orderNumber: orderId,
    date: formattedFullDate,
    timestampMs: Date.now(),
    items: items.map((i) => ({
      name: i.name,
      count: i.count,
      unitPrice: i.unitPrice || Math.round(orderTotal / Math.max(1, items.reduce((acc, it) => acc + it.count, 0))),
      selectedSize: i.selectedSize || 'Regular',
      selectedMilk: i.selectedMilk,
      category: i.category,
    })),
    subtotal: calculatedSubtotal,
    discountAmount: meta?.discountAmount,
    discountLabel: meta?.discountLabel,
    gstAmount: Math.round(orderTotal * 0.05),
    totalAmount: orderTotal,
    pointsEarned: totalEarned,
    status: 'Completed',
    fulfillmentType: meta?.fulfillmentType || 'Dine-In',
    tableNumber: meta?.tableNumber || 'Table #04',
  };

  const currentOrders = loadPastOrders();
  savePastOrders([createdOrder, ...currentOrders]);

  return {
    earnedPoints: totalEarned,
    newBalance,
    newBadges: newlyUnlockedBadges,
    updatedProfile,
    createdOrder,
  };
};

/**
 * Redeems points for a discount coupon.
 */
export const redeemRewardCoupon = (
  reward: DiscountRewardDef
): { success: boolean; message: string; promoCode?: string } => {
  const current = loadRewardsProfile();

  if (current.pointsBalance < reward.pointsCost) {
    return {
      success: false,
      message: `You need ${reward.pointsCost - current.pointsBalance} more points to redeem this reward.`,
    };
  }

  const now = new Date();
  const timeStr = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const newLog: OrderRewardLog = {
    id: `tx-redeem-${Date.now()}`,
    timestamp: timeStr,
    orderNumber: `REDEEM-${reward.promoCode}`,
    title: `Redeemed ${reward.title}`,
    details: `Coupon code unlocked: ${reward.promoCode}`,
    pointsDelta: -reward.pointsCost,
    type: 'reward_redeemed',
  };

  const updatedCodes = current.redeemedCouponCodes.includes(reward.promoCode)
    ? current.redeemedCouponCodes
    : [...current.redeemedCouponCodes, reward.promoCode];

  const updatedProfile: RewardsProfile = {
    ...current,
    pointsBalance: current.pointsBalance - reward.pointsCost,
    redeemedCouponCodes: updatedCodes,
    history: [newLog, ...current.history],
  };

  saveRewardsProfile(updatedProfile);

  return {
    success: true,
    message: `Unlocked "${reward.title}"! Promo code ${reward.promoCode} is now active.`,
    promoCode: reward.promoCode,
  };
};

/**
 * Daily Check-in bonus (+15 pts).
 */
export const claimDailyBonus = (): {
  success: boolean;
  pointsAwarded: number;
  message: string;
} => {
  const current = loadRewardsProfile();
  const todayStr = new Date().toDateString();

  if (current.lastCheckinDate === todayStr) {
    return {
      success: false,
      pointsAwarded: 0,
      message: 'You have already collected today’s Daily Brew bonus! Come back tomorrow.',
    };
  }

  const pointsToAdd = 15;
  const newStreak = (current.streakDays || 0) + 1;
  const newBalance = current.pointsBalance + pointsToAdd;
  const newLifetime = current.lifetimePoints + pointsToAdd;

  const updatedBadgeIds = [...current.unlockedBadgeIds];
  if (newStreak >= 3 && !updatedBadgeIds.includes('streak_enthusiast')) {
    updatedBadgeIds.push('streak_enthusiast');
  }

  const newLog: OrderRewardLog = {
    id: `tx-checkin-${Date.now()}`,
    timestamp: 'Just now',
    orderNumber: 'CHECKIN',
    title: 'Daily Barista Check-In',
    details: `Day ${newStreak} consecutive café ritual streak`,
    pointsDelta: +pointsToAdd,
    type: 'checkin_bonus',
  };

  const updatedProfile: RewardsProfile = {
    ...current,
    pointsBalance: newBalance,
    lifetimePoints: newLifetime,
    streakDays: newStreak,
    lastCheckinDate: todayStr,
    unlockedBadgeIds: updatedBadgeIds,
    history: [newLog, ...current.history],
  };

  saveRewardsProfile(updatedProfile);

  return {
    success: true,
    pointsAwarded: pointsToAdd,
    message: `Collected +${pointsToAdd} daily points! Streak: ${newStreak} days 🔥`,
  };
};

export const resetRewardsToDefault = (): RewardsProfile => {
  saveRewardsProfile(INITIAL_DEMO_PROFILE);
  savePastOrders(INITIAL_PAST_ORDERS);
  return INITIAL_DEMO_PROFILE;
};
