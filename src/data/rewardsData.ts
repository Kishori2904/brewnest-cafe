export interface RewardTierInfo {
  name: 'Bronze Sipper' | 'Silver Roast' | 'Gold Barista Club' | 'Platinum Master';
  minPoints: number;
  maxPoints: number;
  perks: string[];
  color: string;
  badgeBg: string;
}

export const REWARD_TIERS: RewardTierInfo[] = [
  {
    name: 'Bronze Sipper',
    minPoints: 0,
    maxPoints: 199,
    perks: ['1 Point per ₹10 spent', 'Access to contactless QR ordering', 'Secret seasonal menu notifications'],
    color: 'text-amber-800 dark:text-amber-400',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800/60',
  },
  {
    name: 'Silver Roast',
    minPoints: 200,
    maxPoints: 499,
    perks: ['1.2x points multiplier', 'Free plant milk upgrade (Oat/Almond)', 'Annual birthday brew treat'],
    color: 'text-stone-700 dark:text-stone-300',
    badgeBg: 'bg-stone-200 dark:bg-stone-800 border-stone-400 dark:border-stone-600',
  },
  {
    name: 'Gold Barista Club',
    minPoints: 500,
    maxPoints: 999,
    perks: ['1.5x points multiplier', 'Complimentary size upgrade on every brew', 'Priority quiet zone table reservations'],
    color: 'text-yellow-600 dark:text-yellow-400',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-950/60 border-yellow-400 dark:border-yellow-700/60',
  },
  {
    name: 'Platinum Master',
    minPoints: 1000,
    maxPoints: 99999,
    perks: ['2x points multiplier', 'Personal reserved ceramic mug on café wall', 'Invitations to private coffee cupping & roasting workshops'],
    color: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60 border-purple-400 dark:border-purple-700/60',
  },
];

export interface DigitalBadgeDef {
  id: string;
  name: string;
  category: 'Orders' | 'Tasting' | 'Visits' | 'Milestone';
  description: string;
  iconName: 'Coffee' | 'Award' | 'Sparkles' | 'Flame' | 'Crown' | 'Heart' | 'Compass' | 'Clock';
  thresholdText: string;
}

export const DIGITAL_BADGES_CATALOG: DigitalBadgeDef[] = [
  {
    id: 'first_sip',
    name: 'First Sip',
    category: 'Orders',
    description: 'Placed your first coffee or culinary order at BrewNest.',
    iconName: 'Coffee',
    thresholdText: '1 completed order',
  },
  {
    id: 'flavour_explorer',
    name: 'Flavour Explorer',
    category: 'Tasting',
    description: 'Explored dishes across 3 distinct menu categories.',
    iconName: 'Compass',
    thresholdText: '3 categories tasted',
  },
  {
    id: 'morning_ritual',
    name: 'Morning Ritual',
    category: 'Visits',
    description: 'Checked in or ordered before 11:00 AM fresh roast hour.',
    iconName: 'Clock',
    thresholdText: 'Early morning visit',
  },
  {
    id: 'streak_enthusiast',
    name: 'Streak Enthusiast',
    category: 'Visits',
    description: 'Kept a 3-visit café streak alive with daily check-ins or orders.',
    iconName: 'Flame',
    thresholdText: '3-day activity streak',
  },
  {
    id: 'barista_connoisseur',
    name: 'Artisan Connoisseur',
    category: 'Tasting',
    description: 'Ordered one of BrewNest’s handcrafted signature specialty brews.',
    iconName: 'Sparkles',
    thresholdText: 'Signature brew ordered',
  },
  {
    id: 'master_patron',
    name: 'Master Patron',
    category: 'Milestone',
    description: 'Accumulated over 500 lifetime BrewNest rewards points.',
    iconName: 'Crown',
    thresholdText: '500+ lifetime points',
  },
];

export interface DiscountRewardDef {
  id: string;
  title: string;
  pointsCost: number;
  promoCode: string;
  discountType: 'flat' | 'percent' | 'free_item';
  discountAmount: number; // e.g. 50 (₹50 off) or 20 (20% off) or 130 (free bakery item max)
  description: string;
  terms: string;
  badgeTag: string;
}

export const DISCOUNT_REWARDS_CATALOG: DiscountRewardDef[] = [
  {
    id: 'reward_50_off',
    title: '₹50 OFF Any Beverage',
    pointsCost: 100,
    promoCode: 'BREW50',
    discountType: 'flat',
    discountAmount: 50,
    description: 'Enjoy ₹50 off any espresso, iced brew, or pour-over in your order.',
    terms: 'Valid on orders over ₹150. Automatically deducted in order tray.',
    badgeTag: 'Popular',
  },
  {
    id: 'reward_free_bakery',
    title: 'Free Fresh Bakery Item',
    pointsCost: 180,
    promoCode: 'FREEBAKE',
    discountType: 'free_item',
    discountAmount: 130,
    description: 'Redeem a complimentary flaky butter croissant or sourdough muffin.',
    terms: 'Up to ₹130 value. Deducted from the highest-priced snack in tray.',
    badgeTag: 'Best Value',
  },
  {
    id: 'reward_free_signature',
    title: 'Free Signature Specialty Drink',
    pointsCost: 260,
    promoCode: 'SIGFREE',
    discountType: 'flat',
    discountAmount: 220,
    description: 'Any signature specialty drink on the house (Spanish Latte, Hazelnut Cold Foam, etc.).',
    terms: 'Up to ₹220 value. One redemption per transaction.',
    badgeTag: 'Barista Pick',
  },
  {
    id: 'reward_20_percent',
    title: '20% OFF Entire Order Tray',
    pointsCost: 360,
    promoCode: 'VIP20',
    discountType: 'percent',
    discountAmount: 20,
    description: 'Get a full 20% discount applied to your entire table inquiry or takeaway tray.',
    terms: 'Maximum discount of ₹400. Applies across all food & beverages.',
    badgeTag: 'VIP Tier',
  },
];
