import { DailySpecialItem } from '../types';

export const INITIAL_DAILY_SPECIALS: DailySpecialItem[] = [
  {
    id: 'special-cortado-cardamom',
    name: 'Smoked Cardamom Spanish Cortado',
    tagline: 'Coorg Single-Estate Arabica · Spiced Condensed Milk Foam',
    category: 'Coffee',
    originalPrice: 220,
    specialPrice: 145,
    discountPercent: 34,
    description: 'Double shot of single-estate Coorg Arabica pulled over slow-steamed whole milk, infused with house-smoked green cardamom and golden demerara sugar.',
    chefNote: 'Poured with micro-textured silky foam and garnished with hand-crushed cardamom dust.',
    limitedQuantity: 18,
    claimedQuantity: 13,
    badge: '⚡ FLASH ROAST',
    badgeType: 'flash',
    image: '/Images/Smoked Cardamom Spanish Cortado.jpg',
    dietary: 'beverage',
    preparationTime: '3 mins',
    calories: '85 kcal',
    flavorNotes: ['Smoked Oak', 'Sweet Cardamom', 'Rich Dark Cocoa'],
    roastOrOrigin: 'Coorg Single-Estate · Medium Dark Roast',
    availableUntil: '11:00 PM Today',
    orderCountRecent: 4,
  },
  {
    id: 'special-brioche-french-toast',
    name: 'Pecan & Orange Blossom Brioche Toast',
    tagline: 'Artisanal Brioche · Candied Pecans · Citrus Honey Mascarpone',
    category: 'Snacks',
    originalPrice: 340,
    specialPrice: 235,
    discountPercent: 31,
    description: 'Thick-cut golden brioche soaked in rich farm egg custard with orange blossom water, griddled crisp in clarified butter with toasted Georgia pecans.',
    chefNote: 'Finished with warm organic maple drizzle and a generous scoop of citrus mascarpone cream.',
    limitedQuantity: 15,
    claimedQuantity: 12,
    badge: '🥐 BAKER\'S CUT',
    badgeType: 'baker',
    image: '/Images/Pecan & Orange Blossom Brioche Toast.jpg',
    dietary: 'veg',
    preparationTime: '8 mins',
    calories: '380 kcal',
    flavorNotes: ['Candied Pecan', 'Orange Zest', 'Flaky Brioche'],
    roastOrOrigin: 'House In-House Bakery · Fresh Morning Bake',
    availableUntil: 'While Batch Lasts',
    orderCountRecent: 6,
  },
  {
    id: 'special-nitro-cold-brew-float',
    name: 'Nitro Cold Brew & Madagascar Gelato Float',
    tagline: '24-Hour Cold Steep · Micro Nitrogen Bubbles · Vanilla Bean',
    category: 'Coffee',
    originalPrice: 260,
    specialPrice: 175,
    discountPercent: 33,
    description: 'Our signature 24-hour slow drip cold brew charged with nitrogen for a Guinness-like velvety cascade, crowned with authentic scraped Madagascar vanilla gelato.',
    chefNote: 'Drink without a straw to experience the crisp contrast between frosty nitro foam and creamy gelato.',
    limitedQuantity: 20,
    claimedQuantity: 15,
    badge: '❄️ COLD VAULT',
    badgeType: 'roaster',
    image: '/Images/Nitro Cold Brew & Madagascar Gelato Float.jpg',
    dietary: 'beverage',
    preparationTime: '2 mins',
    calories: '160 kcal',
    flavorNotes: ['Velvety Vanilla', 'Stone Fruit', 'Dark Molasses'],
    roastOrOrigin: 'Chikmagalur Red Honey Process · Cold Brew Blend',
    availableUntil: '11:00 PM Today',
    orderCountRecent: 5,
  },
  {
    id: 'special-truffle-mushroom-melt',
    name: 'Truffle Wild Mushroom & Scamorza Sourdough',
    tagline: 'Sautéed Forest Shiitake · White Truffle Emulsion · Smoked Cheese',
    category: 'Main Course',
    originalPrice: 380,
    specialPrice: 265,
    discountPercent: 30,
    description: 'Wild forest shiitake and cremini mushrooms sautéed in thyme butter, pressed between 48-hour fermented sourdough with melted Italian smoked scamorza and truffle aioli.',
    chefNote: 'Served piping hot with house herb-pickled cucumbers and garlic sea salt chips.',
    limitedQuantity: 16,
    claimedQuantity: 12,
    badge: '⭐ CHEF\'S SPECIAL',
    badgeType: 'chef',
    image: '/Images/Truffle Wild Mushroom & Scamorza Sourdough.jpg',
    dietary: 'veg',
    preparationTime: '10 mins',
    calories: '420 kcal',
    flavorNotes: ['Earth Truffle', 'Smoked Wood', 'Crisp Sourdough'],
    roastOrOrigin: 'Crafted Daily by Executive Chef',
    availableUntil: '10:30 PM Today',
    orderCountRecent: 7,
  },
  {
    id: 'special-croissant-cube-pistachio',
    name: 'Rosewater Pistachio Croissant Cube',
    tagline: '72 Laminated Layers · Iranian Pistachio Cream · Persian Rose Glaze',
    category: 'Desserts',
    originalPrice: 290,
    specialPrice: 195,
    discountPercent: 33,
    description: 'Geometric golden croissant baked in specialized square molds, injected with chilled pistachio diplomat cream and finished with crushed green pistachios and dried rose petals.',
    chefNote: 'Crispy outer shell with an intensely airy, velvety cream center that oozes on first bite.',
    limitedQuantity: 14,
    claimedQuantity: 11,
    badge: '🥐 BAKER\'S CUT',
    badgeType: 'baker',
    image: '/Images/Rosewater Pistachio Croissant Cube.jpg',
    dietary: 'veg',
    preparationTime: 'Ready to Serve',
    calories: '310 kcal',
    flavorNotes: ['Roasted Pistachio', 'Wild Rose', 'French Butter'],
    roastOrOrigin: 'Artisan Pastry Kitchen · 9 AM Batch',
    availableUntil: 'Only 3 Left Today',
    orderCountRecent: 3,
  },
  {
    id: 'special-kashmiri-kahwa-latte',
    name: 'Kashmiri Kahwa & Saffron Blonde Fusion',
    tagline: 'Pampore Saffron Strands · Cinnamon Bark · Blonde Espresso',
    category: 'Coffee',
    originalPrice: 250,
    specialPrice: 165,
    discountPercent: 34,
    description: 'Traditional slow-brewed brass samovar spices (saffron, green cardamom, cinnamon) extracted alongside a light floral blonde espresso shot, steamed with almond-infused oat milk.',
    chefNote: 'Topped with slivered toasted almonds and edible gold leaf glimmer.',
    limitedQuantity: 18,
    claimedQuantity: 11,
    badge: '✨ ROASTER\'S VAULT',
    badgeType: 'roaster',
    image: '/Images/Kashmiri Kahwa & Saffron Blonde Fusion.jpg',
    dietary: 'beverage',
    preparationTime: '4 mins',
    calories: '110 kcal',
    flavorNotes: ['Golden Saffron', 'Warm Cinnamon', 'Sweet Almond'],
    roastOrOrigin: 'Ethiopian Yirgacheffe Blonde Roast · Samovar Spice Blend',
    availableUntil: '11:00 PM Today',
    orderCountRecent: 2,
  },
];

const STORAGE_KEY = 'brewnest_daily_specials_state_v1';

export interface SpecialsFetchResult {
  specials: DailySpecialItem[];
  fetchedAt: string;
  closingTimeSeconds: number;
}

/**
 * Calculates remaining seconds until 11:00 PM today (or closes in minimum 2 hours for demo)
 */
export function calculateClosingTimeSeconds(): number {
  const now = new Date();
  const closing = new Date();
  closing.setHours(23, 0, 0, 0); // 11:00 PM

  let diffInSeconds = Math.floor((closing.getTime() - now.getTime()) / 1000);
  if (diffInSeconds <= 0) {
    // If it's already past 11 PM, count down towards tomorrow 11 PM or 4 hours
    diffInSeconds = 4 * 3600 + 15 * 60;
  }
  return diffInSeconds;
}

/**
 * Load persisted claim states from localStorage so claimed items update stock dynamically
 */
function getPersistedSpecials(): DailySpecialItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load specials from localStorage:', e);
  }
  return INITIAL_DAILY_SPECIALS;
}

/**
 * Persist specials state
 */
export function savePersistedSpecials(specials: DailySpecialItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(specials));
  } catch (e) {
    console.warn('Failed to save specials to localStorage:', e);
  }
}

/**
 * Asynchronously fetches today's daily specials with realistic network latency
 */
export async function fetchDailySpecials(forceRefresh = false): Promise<SpecialsFetchResult> {
  // Simulate network latency (300 - 500ms)
  await new Promise((resolve) => setTimeout(resolve, forceRefresh ? 600 : 400));

  let items = getPersistedSpecials();

  if (forceRefresh) {
    // Random slight stock jitter to simulate active café orders in real-time
    items = items.map((item) => {
      const extraClaim = Math.random() > 0.6 ? 1 : 0;
      const newClaimed = Math.min(item.limitedQuantity - 1, item.claimedQuantity + extraClaim);
      return {
        ...item,
        claimedQuantity: newClaimed,
        orderCountRecent: Math.max(1, (item.orderCountRecent || 3) + (extraClaim ? 1 : 0)),
      };
    });
    savePersistedSpecials(items);
  }

  return {
    specials: items,
    fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    closingTimeSeconds: calculateClosingTimeSeconds(),
  };
}

/**
 * Claim/order a special: decrements remaining stock and saves state
 */
export function recordSpecialClaim(specialId: string): DailySpecialItem | null {
  const current = getPersistedSpecials();
  let updatedSpecial: DailySpecialItem | null = null;

  const updatedList = current.map((s) => {
    if (s.id === specialId) {
      const remaining = s.limitedQuantity - s.claimedQuantity;
      if (remaining > 0) {
        const next = {
          ...s,
          claimedQuantity: s.claimedQuantity + 1,
          orderCountRecent: (s.orderCountRecent || 2) + 1,
        };
        updatedSpecial = next;
        return next;
      }
      updatedSpecial = s;
      return s;
    }
    return s;
  });

  savePersistedSpecials(updatedList);
  return updatedSpecial;
}
