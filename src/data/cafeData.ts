import {
  BusinessInfo,
  GalleryItem,
  MenuCategory,
  MenuItem,
  PitchSlide,
  StaffPick,
} from '../types';

const IMAGE_BASE = `${import.meta.env.BASE_URL}Images/`;

export const BUSINESS_INFO: BusinessInfo = {
  name: 'BrewNest',
  tagline: 'Good Food · Great Coffee · Better Mood',
  category: 'CAFÉ & MORE',
  location: 'Noida, Uttar Pradesh',
  description:
    'A cozy place where great food, aromatic coffee and good vibes come together. Enjoy fresh brews, delicious treats and a warm atmosphere — always.',
  phone: '+91 98765 43210',
  email: 'hello@brewnestcafe.com',
  address: '123 Green Park, Sector 12, Noida, Uttar Pradesh - 201301',
  openingHours: 'Mon – Sun: 8:00 AM – 11:00 PM',
  isDemoNotice:
    'BrewNest Café is an artisanal neighborhood sanctuary serving specialty coffee, hearty meals, and fresh bakes in Noida, UP.',
  socials: {
    instagram: 'https://instagram.com/brewnestcafe',
    facebook: 'https://facebook.com/brewnestcafe',
    twitter: 'https://x.com/brewnestcafe',
    linkedin: 'https://linkedin.com/company/brewnestcafe',
  },
};

export const MENU_CATEGORIES: MenuCategory[] = [
  'All',
  'Coffee',
  'Snacks',
  'Main Course',
  'Desserts',
];

export const MENU_ITEMS: MenuItem[] = [
  // 1. Coffee
  {
    id: 'coffee-espresso',
    name: 'Espresso',
    category: 'Coffee',
    price: 80,
    description:
      'Rich, concentrated single shot of freshly ground Arabica beans with a dense golden crema.',
    dietary: 'beverage',
    image: `${IMAGE_BASE}espresso.jpg`,
    vectorAsset: `${IMAGE_BASE}espresso.jpg`,
    tags: ['Single Origin', 'Bold', 'Hot'],
    preparationTime: '2-3 mins',
    calories: '5 kcal',
  },
  {
    id: 'coffee-americano',
    name: 'Americano',
    category: 'Coffee',
    price: 100,
    description:
      'Double espresso pulled over hot water for a deeply aromatic and smooth coffee profile.',
    dietary: 'beverage',
    image: `${IMAGE_BASE}Americano.jpg`,
    vectorAsset: `${IMAGE_BASE}Americano.jpg`,
    tags: ['Classic', 'Black', 'Aromatic'],
    preparationTime: '3 mins',
    calories: '10 kcal',
  },
  {
    id: 'coffee-cappuccino',
    name: 'Cappuccino',
    category: 'Coffee',
    price: 120,
    description:
      'Balanced harmony of rich espresso, silky steamed whole milk, and dense micro-foam dusted with cocoa.',
    dietary: 'beverage',
    isSignature: true,
    image: `${IMAGE_BASE}Cappuccino.jpg`,
    vectorAsset: `${IMAGE_BASE}Cappuccino.jpg`,
    tags: ['Barista Pick', 'Velvety', 'Best Seller'],
    preparationTime: '4 mins',
    calories: '120 kcal',
  },
  {
    id: 'coffee-latte',
    name: 'Latte',
    category: 'Coffee',
    price: 140,
    description:
      'Smooth espresso blended with generous velvety steamed milk, finished with handcrafted latte art.',
    dietary: 'beverage',
    image: `${IMAGE_BASE}latte.jpg`,
    vectorAsset: `${IMAGE_BASE}latte.jpg`,
    tags: ['Creamy', 'Mild', 'Latte Art'],
    preparationTime: '4 mins',
    calories: '150 kcal',
  },
  {
    id: 'coffee-mocha',
    name: 'Mocha',
    category: 'Coffee',
    price: 160,
    description:
      'Decadent dark chocolate melted into freshly pulled espresso, layered with warm milk and whipped cream.',
    dietary: 'beverage',
    image: `${IMAGE_BASE}mocha.jpg`,
    vectorAsset: `${IMAGE_BASE}mocha.jpg`,
    tags: ['Indulgent', 'Chocolate', 'Sweet'],
    preparationTime: '5 mins',
    calories: '240 kcal',
  },
  {
    id: 'coffee-cold-brew',
    name: '16-Hour Artisanal Cold Brew',
    category: 'Coffee',
    price: 150,
    description:
      'Slow-steeped single-origin Arabica over 16 hours for an ultra-smooth, naturally sweet iced coffee with zero acidity, served over clear artisan ice.',
    dietary: 'beverage',
    isSignature: true,
    image: `${IMAGE_BASE}16-Hour Artisanal Cold Brew.jpg`,
    vectorAsset: `${IMAGE_BASE}16-Hour Artisanal Cold Brew.jpg`,
    tags: ['Iced Drink', 'Sunny Day Pick', 'Slow Steeped', 'Cold'],
    preparationTime: '2 mins',
    calories: '5 kcal',
  },
  {
    id: 'coffee-iced-latte',
    name: 'Iced Vanilla Bean Latte',
    category: 'Coffee',
    price: 160,
    description:
      'Double shot of freshly pulled espresso shaken with Madagascar vanilla bean syrup, poured over whole milk and crushed crystal ice.',
    dietary: 'beverage',
    image: `${IMAGE_BASE}espresso.jpg`,
    vectorAsset: `${IMAGE_BASE}espresso.jpg`,
    tags: ['Iced Drink', 'Refreshing', 'Vanilla Bean', 'Cold'],
    preparationTime: '3 mins',
    calories: '160 kcal',
  },
  {
    id: 'coffee-iced-tonic',
    name: 'Sparkling Espresso Tonic',
    category: 'Coffee',
    price: 170,
    description:
      'Crisp Indian botanical tonic water layered with a double float of citrusy espresso and garnished with a flame-expressed orange peel.',
    dietary: 'beverage',
    image: `${IMAGE_BASE}Sparkling Espresso Tonic.jpg`,
    vectorAsset: `${IMAGE_BASE}Sparkling Espresso Tonic.jpg`,
    tags: ['Iced Drink', 'Sparkling', 'Citrus Zest', 'Cold'],
    preparationTime: '3 mins',
    calories: '45 kcal',
  },
  {
    id: 'coffee-iced-caramel',
    name: 'Iced Salted Caramel Frappé',
    category: 'Coffee',
    price: 180,
    description:
      'Blended espresso with creamy milk, house salted caramel drizzle, and whipped cream, topped with caramelized crunchy biscuit crumbs.',
    dietary: 'beverage',
    image: `${IMAGE_BASE}espresso.jpg`,
    vectorAsset: `${IMAGE_BASE}espresso.jpg`,
    tags: ['Iced Drink', 'Frappé', 'Salted Caramel', 'Cold'],
    preparationTime: '4 mins',
    calories: '280 kcal',
  },

  // 2. Snacks
  {
    id: 'snack-fries',
    name: 'French Fries',
    category: 'Snacks',
    price: 120,
    description:
      'Crispy golden potato fingers lightly seasoned with sea salt and served with house dips.',
    dietary: 'veg',
    image: `${IMAGE_BASE}frenchfries.jpg`,
    vectorAsset: `${IMAGE_BASE}frenchfries.jpg`,
    tags: ['Crispy', 'Classic', 'Shareable'],
    preparationTime: '6-8 mins',
    calories: '320 kcal',
  },
  {
    id: 'snack-sandwich',
    name: 'Cheese Sandwich',
    category: 'Snacks',
    price: 150,
    description:
      'Melted cheddar and mozzarella grilled with spiced herb butter inside artisan sourdough bread.',
    dietary: 'veg',
    isSignature: true,
    image: `${IMAGE_BASE}Cheese Sandwich.jpg`,
    vectorAsset: `${IMAGE_BASE}Cheese Sandwich.jpg`,
    tags: ['Grilled', 'Melted Cheese', 'Comfort Food'],
    preparationTime: '8-10 mins',
    calories: '380 kcal',
  },
  {
    id: 'snack-burger',
    name: 'Veg Burger',
    category: 'Snacks',
    price: 160,
    description:
      'Crispy spiced vegetable patty with crisp lettuce, fresh tomatoes, and house burger sauce in a toasted brioche bun.',
    dietary: 'veg',
    image: `${IMAGE_BASE}veg burger.jpg`,
    vectorAsset: `${IMAGE_BASE}veg burger.jpg`,
    tags: ['Brioche', 'House Sauce', 'Crisp Veg'],
    preparationTime: '10 mins',
    calories: '450 kcal',
  },
  {
    id: 'snack-paneer-wrap',
    name: 'Paneer Wrap',
    category: 'Snacks',
    price: 180,
    description:
      'Marinated cottage cheese tossed with crisp bell peppers, onions, and mint coriander chutney in a warm tortilla.',
    dietary: 'veg',
    image: `${IMAGE_BASE}Paneer Wrap.jpg`,
    vectorAsset: `${IMAGE_BASE}Paneer Wrap.jpg`,
    tags: ['High Protein', 'Flaky Wrap', 'Tangy'],
    preparationTime: '10 mins',
    calories: '410 kcal',
  },
  {
    id: 'snack-nachos',
    name: 'Nachos',
    category: 'Snacks',
    price: 140,
    description:
      'Crunchy corn tortilla chips loaded with warm melted cheese sauce, fresh tomato salsa, and jalapenos.',
    dietary: 'veg',
    image: `${IMAGE_BASE}nachos.jpg`,
    vectorAsset: `${IMAGE_BASE}nachos.jpg`,
    tags: ['Crunchy', 'Loaded Cheese', 'Spicy Salsa'],
    preparationTime: '6 mins',
    calories: '360 kcal',
  },
  {
    id: 'snack-garlic-bread',
    name: 'Cheesy Garlic Breadsticks',
    category: 'Snacks',
    price: 160,
    description:
      'Freshly baked artisan sourdough baguette smothered with roasted garlic herb butter, bubbling mozzarella, and fresh rosemary.',
    dietary: 'veg',
    image: `${IMAGE_BASE}Cheesy Garlic Breadsticks.jpg`,
    vectorAsset: `${IMAGE_BASE}Cheesy Garlic Breadsticks.jpg`,
    tags: ['Rainy Day Comfort', 'Molten Cheese', 'Garlic Butter'],
    preparationTime: '8 mins',
    calories: '340 kcal',
  },
  {
    id: 'snack-peri-fries',
    name: 'Spicy Peri-Peri Crisp Fries',
    category: 'Snacks',
    price: 140,
    description:
      'Crispy skin-on golden potato fries tossed in our signature smoky peri-peri spice dust, served with creamy jalapeño mayo.',
    dietary: 'veg',
    image: `${IMAGE_BASE}Spicy Peri-Peri Crisp Fries.jpg`,
    vectorAsset: `${IMAGE_BASE}Spicy Peri-Peri Crisp Fries.jpg`,
    tags: ['Spicy', 'Crispy', 'Monsoon Favorite'],
    preparationTime: '6 mins',
    calories: '330 kcal',
  },

  // 3. Main Course
  {
    id: 'main-alfredo',
    name: 'Creamy Alfredo Pasta',
    category: 'Main Course',
    price: 220,
    description:
      'Penne pasta smothered in rich, velvety garlic parmesan cream sauce with sautéed mushrooms and herbs.',
    dietary: 'veg',
    isSignature: true,
    image: `${IMAGE_BASE}Creamy Alfredo Pasta.jpg`,
    vectorAsset: `${IMAGE_BASE}Creamy Alfredo Pasta.jpg`,
    tags: ['Creamy', 'Italian', 'Parmesan'],
    preparationTime: '12-14 mins',
    calories: '540 kcal',
  },
  {
    id: 'main-arrabiata',
    name: 'Arrabiata Red Sauce Pasta',
    category: 'Main Course',
    price: 210,
    description:
      'Penne cooked al dente in a spicy slow-simmered San Marzano tomato sauce, garlic, and fresh basil.',
    dietary: 'veg',
    image: `${IMAGE_BASE}Arrabiata Red Sauce Pasta.jpg`,
    vectorAsset: `${IMAGE_BASE}Arrabiata Red Sauce Pasta.jpg`,
    tags: ['Spicy', 'Tangy', 'Herb Fresh'],
    preparationTime: '12 mins',
    calories: '440 kcal',
  },
  {
    id: 'main-margherita',
    name: 'Margherita Pizza',
    category: 'Main Course',
    price: 260,
    description:
      '10-inch hand-stretched thin crust topped with classic Italian tomato sauce, mozzarella, and fresh basil leaves.',
    dietary: 'veg',
    image: `${IMAGE_BASE}Margherita Pizza.jpg`,
    vectorAsset: `${IMAGE_BASE}Margherita Pizza.jpg`,
    tags: ['Stone Oven', '10-inch', 'Authentic'],
    preparationTime: '15 mins',
    calories: '650 kcal',
  },
  {
    id: 'main-farmhouse',
    name: 'Farmhouse Veggie Pizza',
    category: 'Main Course',
    price: 290,
    description:
      'Crisp bell peppers, red onions, button mushrooms, black olives, and golden sweet corn on melted mozzarella.',
    dietary: 'veg',
    image: `${IMAGE_BASE}Farmhouse Veggie Pizza.jpg`,
    vectorAsset: `${IMAGE_BASE}Farmhouse Veggie Pizza.jpg`,
    tags: ['Fresh Veggies', 'Loaded', 'Stone Baked'],
    preparationTime: '15 mins',
    calories: '710 kcal',
  },
  {
    id: 'main-paneer-steak',
    name: 'Herb Paneer Steak Platter',
    category: 'Main Course',
    price: 280,
    description:
      'Pan-seared cottage cheese steak infused with rosemary and thyme, served with buttered herb rice and sautéed greens.',
    dietary: 'veg',
    image: `${IMAGE_BASE}Herb Paneer Steak Platter.jpg`,
    vectorAsset: `${IMAGE_BASE}Herb Paneer Steak Platter.jpg`,
    tags: ['Platter', 'Chef Special', 'Nutritious'],
    preparationTime: '15 mins',
    calories: '520 kcal',
  },

  // 4. Desserts
  {
    id: 'dessert-fudge-cake',
    name: 'Chocolate Fudge Cake',
    category: 'Desserts',
    price: 150,
    description:
      'Decadent, rich dark chocolate sponge layered with Belgian chocolate ganache and chocolate flakes.',
    dietary: 'veg',
    isSignature: true,
    image: `${IMAGE_BASE}Chocolate Fudge Cake.jpg`,
    vectorAsset: `${IMAGE_BASE}Chocolate Fudge Cake.jpg`,
    tags: ['Best Seller', 'Belgian Cocoa', 'Decadent'],
    preparationTime: '3 mins',
    calories: '380 kcal',
  },
  {
    id: 'dessert-cheesecake',
    name: 'New York Cheesecake',
    category: 'Desserts',
    price: 180,
    description:
      'Silky smooth baked cream cheese filling on a crumbly butter graham crust with sweet strawberry coulis.',
    dietary: 'veg',
    image: `${IMAGE_BASE}New York Cheesecake.jpg`,
    vectorAsset: `${IMAGE_BASE}New York Cheesecake.jpg`,
    tags: ['Classic NY', 'Silky Smooth', 'Berries'],
    preparationTime: '3 mins',
    calories: '340 kcal',
  },
  {
    id: 'dessert-waffle',
    name: 'Belgian Chocolate Waffle',
    category: 'Desserts',
    price: 190,
    description:
      'Freshly pressed golden Belgian waffle drizzled with warm milk chocolate and dark chocolate sauce.',
    dietary: 'veg',
    image: `${IMAGE_BASE}Belgian Chocolate Waffle.jpg`,
    vectorAsset: `${IMAGE_BASE}Belgian Chocolate Waffle.jpg`,
    tags: ['Freshly Pressed', 'Crispy', 'Warm'],
    preparationTime: '8 mins',
    calories: '420 kcal',
  },
  {
    id: 'dessert-brownie',
    name: 'Walnut Brownie with Ice Cream',
    category: 'Desserts',
    price: 160,
    description:
      'Fudgy warm walnut chocolate brownie served with a generous scoop of smooth vanilla bean ice cream.',
    dietary: 'veg',
    image: `${IMAGE_BASE}Walnut Brownie with Ice Cream.jpg`,
    vectorAsset: `${IMAGE_BASE}Walnut Brownie with Ice Cream.jpg`,
    tags: ['Warm & Cold', 'Walnut Crunch', 'Favorite'],
    preparationTime: '5 mins',
    calories: '410 kcal',
  },
];

export const WHY_CHOOSE_US = [
  {
    id: 'why-1',
    title: 'Premium Coffee',
    description: 'Rich flavors, freshly brewed just for you.',
    badge: '100% Arabica',
  },
  {
    id: 'why-2',
    title: 'Delicious Food',
    description: 'From snacks to desserts, we serve happiness.',
    badge: 'Fresh Daily',
  },
  {
    id: 'why-3',
    title: 'Cozy Ambience',
    description: 'A perfect space to relax, work or catch up.',
    badge: 'Warm & Quiet',
  },
  {
    id: 'why-4',
    title: 'Friendly Service',
    description: 'Our team is always here to make your visit special.',
    badge: 'Hospitality First',
  },
];

export const ABOUT_DATA = {
  heroTagline: 'Our Story, Our Passion',
  storyTitle: 'The Story Behind BrewNest',
  storyParagraph1:
    'BrewNest Café was born from a simple idea — to create a cozy space where people can enjoy great food, aromatic coffee and meaningful moments.',
  storyParagraph2:
    'We believe in good food, warm conversations and the little things that make life better.',
  quote:
    '“Good food brings people together and great coffee keeps them coming back.”',
  pillars: [
    {
      id: 'pillar-1',
      title: 'Fresh Ingredients',
      description: 'We use only the best and freshest ingredients.',
    },
    {
      id: 'pillar-2',
      title: 'Skilled Baristas',
      description: 'Crafting the perfect cup, every time.',
    },
    {
      id: 'pillar-3',
      title: 'A Cozy Space',
      description: 'Designed for comfort, connection and creativity.',
    },
  ],
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Cozy Café Ambience',
    category: 'Ambience',
    image: `${IMAGE_BASE}Cozy Café Ambience.jpg`,
    alt: 'Warm ambient café interior with pendant lights and wooden furniture',
    description:
      'Warm lighting and cozy seating create an inviting space to relax, work, and connect.',
    dimensions: '800 × 600 px',
    fileKey: 'cafe_interior.jpg',
  },
  {
    id: 'gal-2',
    title: 'Artisan Latte Art',
    category: 'Coffee',
    image: `${IMAGE_BASE}espresso.jpg`,
    vectorAsset: `${IMAGE_BASE}espresso.jpg`,
    alt: 'Barista pouring delicate latte art in a ceramic cup',
    description:
      'Freshly extracted single-origin espresso crowned with velvety micro-foam art.',
    dimensions: '800 × 600 px',
    fileKey: 'latte_art.jpg',
  },
  {
    id: 'gal-3',
    title: 'Decadent Chocolate Cake',
    category: 'Desserts',
    image: `${IMAGE_BASE}Decadent Chocolate Cake.jpg`,
    vectorAsset: `${IMAGE_BASE}Decadent Chocolate Cake.jpg`,
    alt: 'Slice of rich chocolate fudge cake on a white plate',
    description:
      'Layered dark Belgian chocolate sponge with silky chocolate ganache.',
    dimensions: '800 × 600 px',
    fileKey: 'chocolate_cake.jpg',
  },
  {
    id: 'gal-4',
    title: 'Gourmet Burger & Fries',
    category: 'Food',
    image: `${IMAGE_BASE}veg burger.jpg`,
    vectorAsset: `${IMAGE_BASE}veg burger.jpg`,
    alt: 'Delicious veg burger with crisp golden french fries',
    description:
      'Toasted brioche bun filled with seasoned crisp patty and house savory sauces.',
    dimensions: '800 × 600 px',
    fileKey: 'burger_fries.jpg',
  },
  {
    id: 'gal-5',
    title: 'Outdoor Garden Terrace',
    category: 'Ambience',
    image: `${IMAGE_BASE}Outdoor Garden Terrace.jpg`,
    vectorAsset: `${IMAGE_BASE}Outdoor Garden Terrace.jpg`,
    alt: 'Peaceful garden patio seating surrounded by lush green plants',
    description:
      'An open-air haven filled with natural light, greenery, and breezy fresh vibes.',
    dimensions: '800 × 600 px',
    fileKey: 'garden_patio.jpg',
  },
  {
    id: 'gal-6',
    title: 'Creamy Cappuccino',
    category: 'Coffee',
    image: `${IMAGE_BASE}Cappuccino.jpg`,
    vectorAsset: `${IMAGE_BASE}Cappuccino.jpg`,
    alt: 'Freshly prepared cappuccino on a wooden saucer with cocoa dusting',
    description:
      'Equal measures of bold espresso, warm milk, and dense foam for pure comfort.',
    dimensions: '800 × 600 px',
    fileKey: 'cappuccino.jpg',
  },
  {
    id: 'gal-7',
    title: 'Quiet Study & Laptop Sanctuary',
    category: 'Workspace',
    image: `${IMAGE_BASE}Quiet Study & Laptop Sanctuary.jpg`,
    vectorAsset: `${IMAGE_BASE}Quiet Study & Laptop Sanctuary1.jpg`,
    alt: 'Co-working café table with laptop, notebook, and hot artisan coffee',
    description:
      'High-speed fiber Wi-Fi, ergonomic wooden desks, and abundant power sockets for deep focus.',
    dimensions: '800 × 600 px',
    fileKey: 'workspace.jpg',
  },
  {
    id: 'gal-8',
    title: 'Stone-Oven Thin Crust Pizza',
    category: 'Food',
    image: `${IMAGE_BASE}Stone-Oven Thin Crust Pizza.jpg`,
    vectorAsset: `${IMAGE_BASE}Stone-Oven Thin Crust Pizza.jpg`,
    alt: 'Freshly baked thin crust margherita pizza with fresh basil',
    description:
      'Hand-stretched sourdough base, San Marzano marinara, and creamy mozzarella blistered to perfection.',
    dimensions: '800 × 600 px',
    fileKey: 'pizza_pasta.jpg',
  },
  {
    id: 'gal-9',
    title: 'Cold Brews & Iced Refresher Coolers',
    category: 'Coffee',
    image: `${IMAGE_BASE}Cold Brews & Iced Refresher Coolers.jpg`,
    vectorAsset: `${IMAGE_BASE}Cold Brews & Iced Refresher Coolers.jpg`,
    alt: 'Glass of cold brew coffee served with ice cubes and lemon zest',
    description:
      'Slow-steeped for 18 hours for low acidity and natural chocolate caramel notes.',
    dimensions: '800 × 600 px',
    fileKey: 'cold_beverages.jpg',
  },
  {
    id: 'gal-10',
    title: 'Artisan Herbal Teas & Infusions',
    category: 'Coffee',
    image: `${IMAGE_BASE}Artisan Herbal Teas & Infusions.jpg`,
    vectorAsset: `${IMAGE_BASE}Artisan Herbal Teas & Infusions.jpg`,
    alt: 'Steaming glass pot of chamomile and mint tea leaves',
    description:
      'Whole leaf loose teas sourced from organic estates in Darjeeling and Kangra Valley.',
    dimensions: '800 × 600 px',
    fileKey: 'herbal_teas.jpg',
  },
];

export const PITCH_SLIDES: PitchSlide[] = [
  {
    id: 1,
    title: 'Concept & Brand Vision',
    duration: '0:00 - 0:45',
    keyTheme: 'BrewNest Café — Artisanal Sanctuary in Noida',
    speakerNotes:
      'Welcome to BrewNest Café. We created a neighborhood haven combining third-wave coffee craft, delicious fresh bakes, and welcoming hospitality designed for modern urban life.',
    talkingPoints: [
      'Concept: Premium Artisanal Coffee & Casual Dining Sanctuary.',
      'Target Audience: Remote workers, students, coffee connoisseurs, and neighborhood families.',
      'Core Brand Pillars: Premium Coffee, Fresh Food, Cozy Ambience, and Friendly Service.',
    ],
    evaluationCriterion:
      'Brand positioning, market concept, and clarity of purpose.',
  },
  {
    id: 2,
    title: 'Menu Architecture & Quality Standards',
    duration: '0:45 - 1:45',
    keyTheme: 'Fresh, Honest Food & Specialty Coffee',
    speakerNotes:
      'Our menu spans Coffee, Snacks, Main Course, and Desserts. Every recipe is prepared fresh without artificial preservatives or pre-packaged shortcuts.',
    talkingPoints: [
      '4 Focused Categories: Coffee, Snacks, Main Course, Desserts.',
      'Ethically Sourced: 100% Indian Arabica beans, local dairy, and fresh bakery loaves.',
      'Inclusive Offerings: Transparent pricing in INR, clear dietary badges, and item customization.',
    ],
    evaluationCriterion:
      'Menu structure, pricing calibration, and ingredient integrity.',
  },
  {
    id: 3,
    title: 'Digital Customer Experience',
    duration: '1:45 - 2:45',
    keyTheme: 'Seamless Web Discovery & Instant Booking',
    speakerNotes:
      'The BrewNest web experience provides effortless exploration: multi-page navigation across Home, About, Menu, Gallery, and Contact, alongside instant Table Booking and an interactive Inquiry Tray.',
    talkingPoints: [
      'Fast, Responsive Single Page Architecture with multi-view support.',
      'Instant Table Booking modal with live seat reservation and guest preference options.',
      'Curated Gallery with high-resolution photography and lightbox zoom.',
    ],
    evaluationCriterion:
      'User interface responsiveness, aesthetic fidelity, and usability.',
  },
];

export interface MoodPairing {
  id: string;
  moodName: string;
  tagline: string;
  iconName: string;
  drinkId: string;
  foodId: string;
  comboBadge: string;
  story: string;
}

export const MOOD_PAIRINGS: MoodPairing[] = [
  {
    id: 'focus-study',
    moodName: 'Focus & Study Session',
    tagline: 'High alertness & sustained mental stamina',
    iconName: 'Laptop',
    drinkId: 'coffee-cappuccino',
    foodId: 'snack-sandwich',
    comboBadge: 'Student & Creator Pick',
    story:
      'Velvety micro-foam cappuccino paired with a warm grilled cheese sandwich for sustained creative energy.',
  },
  {
    id: 'cozy-unwind',
    moodName: 'Cozy & Unwind',
    tagline: 'Smooth comfort & warmth',
    iconName: 'BookOpen',
    drinkId: 'coffee-latte',
    foodId: 'dessert-fudge-cake',
    comboBadge: 'Afternoon Delight',
    story:
      'Silky smooth latte paired with rich dark chocolate fudge cake for a luxurious comforting break.',
  },
  {
    id: 'sweet-indulgence',
    moodName: 'Sweet Celebration',
    tagline: 'Decadent chocolate & espresso boost',
    iconName: 'Sparkles',
    drinkId: 'coffee-mocha',
    foodId: 'dessert-waffle',
    comboBadge: 'Weekend Favorite',
    story:
      'Rich dark mocha paired with a freshly pressed Belgian chocolate waffle.',
  },
  {
    id: 'crispy-crunch',
    moodName: 'Savory Crunch & Refresh',
    tagline: 'Bold black coffee & loaded bites',
    iconName: 'Zap',
    drinkId: 'coffee-americano',
    foodId: 'snack-burger',
    comboBadge: 'Lunch Special',
    story:
      'Aromatic hot Americano cutting through the rich savory crunch of our gourmet veg burger.',
  },
];

export const LANDMARK_DISTANCES = [
  {
    name: 'Sector 18 Metro Hub (Atta Market)',
    landmarkType: 'Commercial Center & Blue Line Metro',
    distance: '3.8 km',
    driveTime: '8-10 mins',
    walkTime: '30 mins',
    tip: 'Direct connection via Sector 12/22 Main Road. Quick cab or auto-rickshaw access.',
  },
  {
    name: 'Sector 50 Metro Station (Aqua Line)',
    landmarkType: 'Rapid Transit Metro',
    distance: '2.5 km',
    driveTime: '5-6 mins',
    walkTime: '18 mins',
    tip: 'Fast connection to Greater Noida Aqua Line and Central Noida sectors.',
  },
  {
    name: 'Logix City Centre (Sector 32)',
    landmarkType: 'Shopping Mall & Cinepolis',
    distance: '3.2 km',
    driveTime: '7-9 mins',
    walkTime: '25 mins',
    tip: 'Just minutes away from Noida City Centre metro station.',
  },
  {
    name: 'DND Flyway Entry',
    landmarkType: 'Delhi Express Highway Link',
    distance: '6.5 km',
    driveTime: '12-15 mins',
    walkTime: 'N/A',
    tip: 'Effortless 15-minute commute from South Delhi and Mayur Vihar.',
  },
];

export const STAFF_PICKS: StaffPick[] = [
  {
    id: 'staff-pick-sun',
    dayOfWeek: 0,
    dayName: 'Sunday',
    theme: 'Sunday Serenity',
    menuItemId: 'coffee-latte',
    baristaName: 'Kabir Sharma',
    baristaRole: 'Head Roaster & Latte Artist',
    baristaAvatar: `${IMAGE_BASE}2.jpg`,
    headline: 'Velvety Rosette Single-Origin Latte',
    personalNote:
      'Sundays at BrewNest are made for taking it slow. I pull a naturally sweet, floral Arabica shot and free-pour a multi-leaf rosette with whole farm milk aerated to precisely 62°C. No sugar needed—just pure comforting warmth.',
    pairingItemId: 'dessert-waffle',
    pairingReason:
      'The warm caramelized waffle drizzled with melted Belgian cocoa harmonizes with the smooth milk foam.',
    brewingSecret:
      'Steamed with a gentle vortex swirl for micro-foam dense enough to support raw brown sugar.',
    flavorNotes: ['Floral Arabica', 'Caramelized Crema', 'Silky Micro-foam'],
  },
  {
    id: 'staff-pick-mon',
    dayOfWeek: 1,
    dayName: 'Monday',
    theme: 'Monday Morning Focus',
    menuItemId: 'coffee-americano',
    baristaName: 'Aarav Verma',
    baristaRole: 'Morning Shift Lead Barista',
    baristaAvatar: `${IMAGE_BASE}3.jpg`,
    headline: 'Double-Shot Crema Float Americano',
    personalNote:
      'Monday mornings in Noida demand crisp clarity. I calibrate the grinder extra fine at 6:45 AM, pulling two dense shots of Chikmagalur Arabica over 82°C mineral water to preserve the fragrant crema ring.',
    pairingItemId: 'snack-sandwich',
    pairingReason:
      'The toasted crunch and melted cheddar of our grilled sourdough balances the clean, brisk coffee acidity.',
    brewingSecret:
      'Water poured first, espresso floated on top (Long Black style) to keep the crema intact.',
    flavorNotes: ['Dark Cacao', 'Toasted Walnut', 'Bright Citrus Zest'],
  },
  {
    id: 'staff-pick-tue',
    dayOfWeek: 2,
    dayName: 'Tuesday',
    theme: 'Tuesday Classic Craft',
    menuItemId: 'coffee-cappuccino',
    baristaName: 'Sneha Patel',
    baristaRole: 'Senior Barista & Sensory Specialist',
    baristaAvatar: `${IMAGE_BASE}1.jpg`,
    headline: 'Traditional 1:1:1 Micro-Foam Cappuccino',
    personalNote:
      'Too many places serve cappuccinos that are basically lattes. Here, I honor the true Italian thirds rule: one-third bold ristretto, one-third steamed milk, and one-third pillow-dense micro-foam dusted with raw organic Ecuadorian cocoa.',
    pairingItemId: 'dessert-cheesecake',
    pairingReason:
      'The tart strawberry coulis and velvety cream cheese provide an exquisite contrast to the roasted cocoa notes.',
    brewingSecret:
      'Dusted with dark cocoa directly onto the crema before the final foam dollop.',
    flavorNotes: ['Roasted Hazelnut', 'Bittersweet Cocoa', 'Creamy Body'],
  },
  {
    id: 'staff-pick-wed',
    dayOfWeek: 3,
    dayName: 'Wednesday',
    theme: 'Midweek Comfort',
    menuItemId: 'snack-sandwich',
    baristaName: 'Devansh Kapoor',
    baristaRole: 'Executive Kitchen Lead',
    baristaAvatar: `${IMAGE_BASE}4.jpg`,
    headline: 'Cast-Iron Artisan Grilled Cheese',
    personalNote:
      'When you hit the Wednesday slump, nothing beats authentic melted comfort. We brush artisan sourdough with slow-steeped rosemary-garlic butter and griddle both sides until cheddar and mozzarella bubble into crispy lacy edges.',
    pairingItemId: 'coffee-latte',
    pairingReason:
      'A warm, creamy latte softens the sharp aged cheddar and refreshes your palate with every bite.',
    brewingSecret:
      'Pressed under a weighted cast-iron press for even browning and molten center.',
    flavorNotes: [
      'Crispy Sourdough Crust',
      'Sharp Aged Cheddar',
      'Garlic Rosemary Butter',
    ],
  },
  {
    id: 'staff-pick-thu',
    dayOfWeek: 4,
    dayName: 'Thursday',
    theme: 'Thursday Indulgence',
    menuItemId: 'coffee-mocha',
    baristaName: 'Rohan Singhania',
    baristaRole: 'Specialty Beverage Alchemist',
    baristaAvatar: `${IMAGE_BASE}5.jpg`,
    headline: 'Belgian Dark Callet Mocha',
    personalNote:
      'Most commercial mochas are loaded with artificial chocolate syrup. We melt real 70% Callebaut dark chocolate buttons in boiling double espresso before pouring silky milk. It is rich, authentic, and bittersweet.',
    pairingItemId: 'dessert-brownie',
    pairingReason:
      'Double the chocolate bliss: warm nutty brownie with cold vanilla ice cream amplifies the cocoa complexity.',
    brewingSecret:
      'Whisked by hand to emulsify cocoa butter into the espresso oils before adding steamed milk.',
    flavorNotes: ['70% Dark Ganache', 'Bold Espresso Core', 'Vanilla Bean Crema'],
  },
  {
    id: 'staff-pick-fri',
    dayOfWeek: 5,
    dayName: 'Friday',
    theme: 'Friday Evening Unwind',
    menuItemId: 'main-alfredo',
    baristaName: 'Meera Nair',
    baristaRole: 'Sous Chef & Beverage Curator',
    baristaAvatar: `${IMAGE_BASE}7.jpg`,
    headline: 'Garlic Parmesan Penne Alfredo',
    personalNote:
      'Friday evening signals celebration time. We toss penne al dente in a velvety reduction of French butter, heavy cream, roasted garlic, and freshly grated 24-month Grana Padano with sautéed button mushrooms.',
    pairingItemId: 'coffee-americano',
    pairingReason:
      'A clean iced or hot Americano slices effortlessly through the rich parmesan cream.',
    brewingSecret:
      'Pasta water emulsified at high flame right before plating creates glossy, clinging richness.',
    flavorNotes: ['Nutty Grana Padano', 'Roasted Sweet Garlic', 'Earthwood Mushrooms'],
  },
  {
    id: 'staff-pick-sat',
    dayOfWeek: 6,
    dayName: 'Saturday',
    theme: 'Saturday Sweet Euphoria',
    menuItemId: 'dessert-fudge-cake',
    baristaName: 'Ananya Roy',
    baristaRole: 'Head Pastry & Bakery Artisan',
    baristaAvatar: `${IMAGE_BASE}6.jpg`,
    headline: 'Three-Tier Belgian Fudge Cake',
    personalNote:
      'I spend Saturday mornings layering our dark cocoa chiffon with warm Belgian ganache. Each slice is brushed with our cold brew espresso soak, keeping it moist, fudge-dense, and deeply aromatic.',
    pairingItemId: 'coffee-cappuccino',
    pairingReason:
      'The airy foam and espresso punch of our Cappuccino cuts through the dense chocolate fudge.',
    brewingSecret:
      'Cold-infused with espresso syrup for 12 hours before slicing.',
    flavorNotes: ['Dark Belgian Fudge', 'Moist Espresso Sponge', 'Bittersweet Shavings'],
  },
];