export type NavPage = 'home' | 'about' | 'menu' | 'gallery' | 'contact';

export type MenuCategory =
  | 'All'
  | 'Coffee'
  | 'Snacks'
  | 'Main Course'
  | 'Desserts';

export type DietaryType = 'veg' | 'non-veg' | 'beverage';

export type SeatingZone = 'window' | 'study' | 'lounge' | 'patio';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  price: number;
  description: string;
  dietary: DietaryType;
  isSignature?: boolean;
  image: string;
  vectorAsset?: string;
  tags: string[];
  preparationTime?: string;
  calories?: string;
  customizationOptions?: {
    sizes?: { name: string; priceDelta: number }[];
    milks?: { name: string; priceDelta: number }[];
    extras?: { name: string; priceDelta: number }[];
  };
}

export interface TrayItem {
  id: string;
  item: MenuItem;
  count: number;
  selectedSize?: string;
  selectedMilk?: string;
  selectedExtras?: string[];
  unitPrice: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  vectorAsset?: string;
  alt: string;
  description: string;
  dimensions: string;
  fileKey: string;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  category: string;
  location: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  isDemoNotice: string;
  socials: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
}

export interface ReservationInquiry {
  fullName: string;
  phone: string;
  email: string;
  inquiryType: 'table' | 'takeaway' | 'event' | 'general';
  seatingZone: SeatingZone;
  date: string;
  time: string;
  guestCount: number;
  specialRequests: string;
  selectedItems?: MenuItem[];
}

export interface PitchSlide {
  id: number;
  title: string;
  duration: string;
  keyTheme: string;
  speakerNotes: string;
  talkingPoints: string[];
  evaluationCriterion: string;
}

export interface LandmarkDistance {
  name: string;
  landmarkType: string;
  distance: string;
  driveTime: string;
  walkTime: string;
  tip: string;
}

export interface StaffPick {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayName: string;
  theme: string;
  menuItemId: string;
  baristaName: string;
  baristaRole: string;
  baristaAvatar: string;
  headline: string;
  personalNote: string;
  pairingItemId?: string;
  pairingReason?: string;
  brewingSecret?: string;
  flavorNotes: string[];
}

export interface DailySpecialItem {
  id: string;
  name: string;
  tagline: string;
  category: Exclude<MenuCategory, 'All'>;
  originalPrice: number;
  specialPrice: number;
  discountPercent: number;
  description: string;
  chefNote: string;
  limitedQuantity: number;
  claimedQuantity: number;
  badge: string;
  badgeType: 'flash' | 'baker' | 'roaster' | 'chef';
  image: string;
  dietary: DietaryType;
  preparationTime: string;
  calories?: string;
  flavorNotes: string[];
  roastOrOrigin?: string;
  availableUntil: string;
  orderCountRecent?: number;
}

export type WaitlistStatus = 'waiting' | 'ready' | 'seated' | 'cancelled';

export interface WaitlistEntry {
  id: string;
  queueNumber: number;
  guestName: string;
  phone: string;
  partySize: number;
  seatingZone: string;
  joinedAt: number;
  estimatedWaitMinutes: number;
  status: WaitlistStatus;
  assignedTable?: string;
}

export interface TableFeedback {
  id: string;
  customerName: string;
  tableNumber: string;
  rating: number; // 1 to 5 stars
  feedbackText: string;
  favoriteItem?: string;
  diningType: 'dine-in' | 'patio' | 'quick-sip' | 'family';
  createdAt: string;
  verifiedVisit?: boolean;
}

