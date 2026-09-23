# BrewNest Café – Local Business Digital Platform

**Repository:** `FUTURE_FS_03`  
**Internship:** Future Interns – Full Stack Web Development Internship  
**Task:** Task 3 – Local Business Website & Live Pitch Project  
**Target Platform:** React 19 + TypeScript + Vite + Tailwind CSS  
**Business Category:** Café / Coffee Shop  
**Location:** Greater Noida, Uttar Pradesh, India  

---

## 📌 1. Project Overview

**BrewNest Café** is a realistic demo neighborhood café digital platform developed for **Task 3 (Local Business Website & Live Pitch Project)** of the Future Interns Full Stack Web Development Internship. 

The website provides an engaging, high-performance web presence for a modern neighborhood café situated in **Greater Noida, Uttar Pradesh**. It showcases handcrafted artisan coffee, freshly prepared meals, light snacks, desserts, co-working accommodations, an interactive inquiry tray, a validated table reservation engine, and an interactive 3–5 minute live pitch deck designed for project evaluation.

> 🛡️ **Ethical & Academic Integrity Disclaimer:**  
> This application is a realistic demo business concept. In strict adherence to project guidelines, **no fabricated customer reviews, false star ratings, fictitious awards, sales metrics, or invented certifications are presented.** All contact details (phone, email, exact street address, and opening hours) are explicitly demarcated as placeholders ready for enterprise onboarding.

---

## ☕ 2. Business Details & Taxonomy

| Parameter | Specification | Status |
|---|---|---|
| **Business Name** | BrewNest Café | Configured |
| **Category** | Café / Coffee Shop | Local Business |
| **Location** | Greater Noida, Uttar Pradesh | Primary Market |
| **Address** | `[Business Address, Greater Noida, Uttar Pradesh]` | Explicit Placeholder |
| **Phone** | `[Business Phone]` | Explicit Placeholder |
| **Email** | `[Business Email]` | Explicit Placeholder |
| **Opening Hours** | `[Opening Hours]` | Explicit Placeholder |
| **Core Concept** | Neighborhood café offering coffee, refreshments, snacks, meals, desserts, and casual co-working. | Fully Modeled |

---

## 🍽️ 3. Menu Categories (7 Complete Services)

The platform features an interactive catalog across seven distinct services:

1. **Coffee & Espresso:** Artisan Hazelnut Cappuccino, Signature Flat White, V60 Slow Drip Pour-Over, Salted Caramel Mocha.
2. **Tea & Refreshments:** Kashmiri Kahwa Green Infusion, Lemongrass Mint Citrus Breeze, Earl Grey Lavender Blossom.
3. **Sandwiches & Burgers:** Pesto Paneer Sourdough Panini, Smoky Chipotle Crisp Burger, Herb Grilled Chicken Panini.
4. **Pasta & Pizza:** Wild Mushroom Truffle Stone Pizza (10"), Creamy Sun-Dried Tomato Penne, Classic Margherita Rustica.
5. **Desserts:** Classic Mascarpone Tiramisu, Basque Burnt Cheesecake Slice, Warm Belgian Chocolate Lava Cake.
6. **Cold Beverages:** Signature Vanilla Bean Cold Brew (18-Hour Steep), Berry Hibiscus Iced Spritzer, Vietnamese Iced Latte.
7. **Snacks:** Loaded Truffle & Herb Fries, Artisan Garlic Herb Bruschetta, Fiesta Cheese Nachos Bowl.

### Menu UX Highlights:
- **Instant Category Filtering:** One-click filtering between all 7 categories.
- **Dietary Filter:** Instant toggle for Vegetarian, Non-Vegetarian, and Beverage items.
- **Live Search:** Instant fuzzy matching across dish names, ingredients, and tags.
- **Order Inquiry Tray:** Dynamic tray that calculates sample order costs in Indian Rupees (₹) and allows users to transfer items directly into their reservation notes.

---

## 🖼️ 4. Centralized Replaceable Gallery (`public/images/`)

All images are organized under `public/images/` as labeled vector SVG placeholders with specified aspect ratios and dimensions:

| File Name | Intended Asset | Recommended Size | Format |
|---|---|---|---|
| `hero_cafe.svg` | Hero banner & barista counter | 1200 × 700 px | SVG / JPG / WebP |
| `coffee_espresso.svg` | Handcrafted espresso & latte art | 800 × 600 px | SVG / JPG / WebP |
| `tea_refreshments.svg` | Teapot infusion & herbal botanicals | 800 × 600 px | SVG / JPG / WebP |
| `sandwiches_burgers.svg` | Sourdough paninis & gourmet burger | 800 × 600 px | SVG / JPG / WebP |
| `pasta_pizza.svg` | Thin-crust stone pizza & pasta | 800 × 600 px | SVG / JPG / WebP |
| `desserts_pastry.svg` | Tiramisu layers & cheesecake bakes | 800 × 600 px | SVG / JPG / WebP |
| `cold_beverages.svg` | Iced cold brew & condensed milk latte | 800 × 600 px | SVG / JPG / WebP |
| `snacks_bites.svg` | Truffle fries & loaded nachos platter | 800 × 600 px | SVG / JPG / WebP |
| `cafe_interior.svg` | Warm ambient armchairs & book nooks | 800 × 600 px | SVG / JPG / WebP |
| `seating_workspace.svg` | Co-working tables & charging outlets | 800 × 600 px | SVG / JPG / WebP |

### Replacing with Real Photos:
To swap in authentic photography, simply place your photo files into `public/images/` using the matching file name or adjust `src/data/cafeData.ts`. The interactive lightbox includes a "Copy File Path" button for seamless asset updates.

---

## 🔍 5. Local-Business SEO & Accessibility Architecture

- **Semantic Schema.org JSON-LD:** Implemented `<script type="application/ld+json">` representing `CafeOrCoffeeShop` in Greater Noida, UP, specifying coordinates (`28.4744° N, 77.5040° E`), cuisine categories, currency (`INR`), and menu URL.
- **OpenGraph & Twitter Card Metadata:** Complete social graph tags (`og:title`, `og:description`, `og:site_name`, `og:locale`, `twitter:card`).
- **Semantic HTML5:** Proper document landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Accessibility (WCAG AA):** High-contrast color ratios, visible focus outlines, minimum 44px touch targets on mobile, and descriptive ARIA attributes across all interactive modals.
- **Unique HTML IDs:** Every interactive button, input field, and modal container carries a distinct ID attribute for automated test scripts and DOM querying.

---

## 📋 6. Contact & Reservation Form Validation

The contact module contains comprehensive client-side form validation:
- **Full Name:** Required, minimum 2 characters.
- **Phone Number:** Required, checked against international/Indian 8–15 digit formatting rules.
- **Email Address:** Required, checked against RFC-compliant email regex.
- **Date & Time:** Date picker restricted to current and future dates; time selector with café operating slots.
- **Guest Count:** Validated numeric range (1 to 30 guests).
- **Inquiry Purpose:** Multi-option selection (Table Reservation, Takeaway Order, Event / Group Booking, General Query).
- **Interactive Submission Simulation:** Produces a unique confirmation reference code (`BN-GN-XXXX`) with full booking summary.

---

## 🎙️ 7. 3–5 Minute Live Pitch Presentation Content

*(Also accessible directly inside the web application via the "Live Pitch Deck" button in the header and hero section, complete with an interactive live stopwatch timer).*

### Slide 1: Introduction, Mission & Problem Statement (0:00 – 0:45)
- **Theme:** The neighborhood café gap in Greater Noida.
- **Talking Points:**
  - Fast-growing educational and commercial hub home to universities, research centers, and young professionals.
  - Many neighborhood eateries lack responsive, transparent web portals that communicate menu options, seating ambiance, and dietary details.
  - Ethical presentation: 100% transparent demo without false reviews or artificial credentials.
- **Presenter Verbatim Script:**
  > *"Welcome everyone. Today I am presenting Task 3 of the Future Interns Full Stack Web Development Internship: the local business digital platform for BrewNest Café. Greater Noida is one of Northern India's fastest-growing educational and residential hubs, home to thousands of university students, researchers, and young professionals. However, neighborhood cafés often lack a modern, performant web presence that clearly conveys their dining offerings, dietary specifics, seating ambiance, and reservation channels."*

### Slide 2: Value Proposition & Menu Architecture (0:45 – 1:45)
- **Theme:** Comprehensive culinary taxonomy & co-working lifestyle.
- **Talking Points:**
  - Seven distinct menu categories covering morning espressos, midday sandwiches, and evening stone pizzas.
  - Calibrated demo pricing in Indian Rupees (₹) suitable for the Greater Noida market.
  - Interactive Order Tray calculating subtotal costs and linking directly to reservations.
- **Presenter Verbatim Script:**
  > *"BrewNest Café solves this with a multi-category menu that spans morning espresso rituals, midday co-working snacks, and relaxed evening dinners. Notice how our platform segments seven distinct categories—from Coffee & Espresso to Pasta, Sandwiches, Cold Beverages, and Snacks. Every item features upfront demo pricing in INR, preparation estimates, caloric transparency, and dietary tags so customers can plan visits or build a customized inquiry tray directly from the site."*

### Slide 3: Technical Stack & SEO Architecture (1:45 – 2:45)
- **Theme:** Modern, robust web engineering.
- **Talking Points:**
  - Modern stack: React 19, TypeScript, Vite, Tailwind CSS v4.
  - Local SEO: Schema.org `CafeOrCoffeeShop` JSON-LD structured data with Greater Noida geo-coordinates.
  - Accessibility: WCAG AA contrast, touch-friendly tap targets (≥44px), semantic HTML5 landmarks.
- **Presenter Verbatim Script:**
  > *"On the engineering side, this web application is engineered with React 19, TypeScript, and Tailwind CSS. We implemented comprehensive local business SEO through Schema.org JSON-LD using the CafeOrCoffeeShop schema, OpenGraph sharing cards, and semantic HTML5 landmarks. For accessibility, we maintain strict WCAG AA contrast, explicit HTML IDs on all interactive controls, and fluid responsive layouts that adapt from 320px mobile screens to 4K displays."*

### Slide 4: User Journey & Reservation Engine (2:45 – 3:45)
- **Theme:** Converting casual visitors into booked tables.
- **Talking Points:**
  - Intuitive user conversion funnel: Hero discovery → Filtered menu → Ambiance gallery → Validated reservation form.
  - Real-time client-side error handling for dates, guest counts, and contact fields.
  - Simulated booking reference generator (`BN-GN-XXXX`) displaying an itemized summary.
- **Presenter Verbatim Script:**
  > *"Let us examine the customer conversion funnel. A visitor starts with our hero visual, browses the interactive menu or filtered gallery, inspects the venue's co-working capabilities in the Why Choose Us section, and then converts via our validated Reservation & Inquiry engine. The form provides real-time client-side validation for dates, guest counts, and contact formats, returning a structured reference ID to simulate real operational reception."*

### Slide 5: Deployment Strategy & Future Roadmap (3:45 – 4:45)
- **Theme:** Handover readiness and commercial scale.
- **Talking Points:**
  - Static production build with zero runtime server dependencies.
  - Ready for Google Cloud Run, Vercel, Netlify, or GitHub Pages.
  - Future roadmap: WhatsApp Web ordering integration, real-time table seating availability, and UPI payment gateways.
- **Presenter Verbatim Script:**
  > *"Finally, this codebase is 100% deployment-ready. It compiles into static production assets via npm run build, suitable for instant deployment on Google Cloud Run, Vercel, Netlify, or GitHub Pages. When an actual café operator assumes ownership, our clear asset guide in public/images/README.md and central data file allow replacing all placeholders in minutes. In the next phase, we can introduce WhatsApp order routing, live table availability, and digital UPI payment checkout."*

---

## 🚀 8. Setup & Deployment Instructions

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 1. Local Development
```bash
# Clone the repository
git clone https://github.com/[username]/FUTURE_FS_03.git
cd FUTURE_FS_03

# Install dependencies
npm install

# Start local development server
npm run dev
# Open http://localhost:3000 in your browser
```

### 2. Building for Production
```bash
# Compile TypeScript and Vite static assets
npm run build

# Preview production build locally
npm run preview
```
The compiled files are created inside the `dist/` directory.

### 3. Deploying to Vercel
1. Push your repository to GitHub (`FUTURE_FS_03`).
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your `FUTURE_FS_03` repository.
4. Set **Framework Preset** to **Vite**.
5. Ensure the Build Command is `npm run build` and Output Directory is `dist`.
6. Click **Deploy**.

### 4. Deploying to Netlify
1. Log into [Netlify](https://netlify.com) and choose **"Import an existing project"**.
2. Link your GitHub repository.
3. Set **Build command** to `npm run build`.
4. Set **Publish directory** to `dist`.
5. Click **Deploy Site**.

### 5. Deploying to Google Cloud Run
This application is fully compatible with Google Cloud Run using containerized static serving behind an Nginx reverse proxy.

---

## 📁 9. Project Directory Structure

```
FUTURE_FS_03/
├── .env.example                      # Documented environment variables
├── index.html                        # Entry point with SEO metadata & JSON-LD
├── metadata.json                     # Application manifest & capabilities
├── package.json                      # Project dependencies & scripts
├── tsconfig.json                     # TypeScript compiler configuration
├── vite.config.ts                    # Vite build configuration
├── README.md                         # Comprehensive project documentation
├── public/
│   └── images/                       # Centralized replaceable image placeholders
│       ├── README.md                 # Asset replacement guide
│       ├── hero_cafe.svg             # Hero banner placeholder
│       ├── coffee_espresso.svg       # Espresso & coffee placeholder
│       ├── tea_refreshments.svg      # Tea & refreshments placeholder
│       ├── sandwiches_burgers.svg    # Sandwiches & burgers placeholder
│       ├── pasta_pizza.svg           # Pasta & pizza placeholder
│       ├── desserts_pastry.svg       # Desserts placeholder
│       ├── cold_beverages.svg        # Cold drinks & iced lattes placeholder
│       ├── snacks_bites.svg          # Appetizers & snacks placeholder
│       ├── cafe_interior.svg         # Ambient seating placeholder
│       └── seating_workspace.svg     # Study/work area placeholder
└── src/
    ├── main.tsx                      # React root entry point
    ├── App.tsx                       # Master layout & state management
    ├── index.css                     # Tailwind CSS v4 & custom typography
    ├── types.ts                      # Shared TypeScript data models
    ├── data/
    │   └── cafeData.ts               # Centralized business, menu & pitch data
    └── components/
        ├── Navbar.tsx                # Header with brand logo, nav & tray trigger
        ├── Hero.tsx                  # Hero banner with CTAs & demo disclosure
        ├── MenuSection.tsx           # 7-category menu with search & filters
        ├── MenuItemModal.tsx         # Detailed item quick-view modal
        ├── OrderTrayDrawer.tsx       # Dynamic inquiry calculator & order tray
        ├── AboutSection.tsx          # Café origin, Greater Noida focus & values
        ├── WhyUsSection.tsx          # 6 service & quality pillars
        ├── GallerySection.tsx        # Responsive photo showcase with lightbox
        ├── GalleryLightbox.tsx       # Image detail & path copy modal
        ├── BusinessInfoSection.tsx   # Hours, phone, email & Greater Noida map
        ├── ContactSection.tsx        # Client-validated reservation/inquiry form
        ├── PitchDeckModal.tsx        # 3–5 min live pitch deck with stopwatch
        ├── DeploymentGuideModal.tsx  # Interactive task rubric & deploy instructions
        └── Footer.tsx                # Footer with links, hours & ethics notice
```

---

## 🏆 10. Future Interns Task 3 Deliverables Checklist

- [x] **Complete Source Code:** Written in modern React 19 + TypeScript + Vite.
- [x] **Professional README.md:** Covers business context, architecture, setup, pitch, and deployment.
- [x] **Responsive Design:** Fluid layouts tested from mobile viewports to desktop screens.
- [x] **Local-Business SEO Structure:** Semantic `<meta>` tags and `CafeOrCoffeeShop` Schema.org JSON-LD.
- [x] **Contact/Enquiry Form with Validation:** Required field checks, phone/email format validation, error indicators, and demo confirmation tokens.
- [x] **Services/Menu Section:** All 7 required categories with prices, preparation times, and dietary markers.
- [x] **Gallery with Replaceable Images:** Stored under `public/images/` with dimension guides.
- [x] **About Section:** Neighborhood café story focusing on Greater Noida students and professionals.
- [x] **Why Choose Us Section:** 6 distinct pillars detailing quality and hospitality.
- [x] **Business Information Section:** Verified placeholders for address, hours, phone, and email.
- [x] **CTA Sections:** Dual hero CTAs, menu order triggers, and table reservation anchors.
- [x] **Footer:** Comprehensive footer with brand identity, hours placeholder, and academic disclaimer.
- [x] **Deployment Instructions:** Step-by-step instructions for Vercel, Netlify, Cloud Run, and GitHub.
- [x] **3–5 Minute Live Pitch Content:** Documented in README and runnable via interactive modal with stopwatch.
- [x] **Honest Academic Transparency:** Zero fabricated reviews, fake awards, or false ratings.
