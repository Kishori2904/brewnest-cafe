import React from 'react';
import { Clock, Coffee, Users } from 'lucide-react';
import { ABOUT_DATA } from '../data/cafeData';

interface AboutSectionProps {
  showHeaderBanner?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ showHeaderBanner = true }) => {
  return (
    <div className="bg-[#FAF7F2] dark:bg-[#120A06] transition-colors duration-300">
      {/* Top Banner matching Screen 2 */}
      {showHeaderBanner && (
        <div className="relative h-64 sm:h-72 lg:h-80 flex items-center justify-center bg-[#1A0E08] overflow-hidden">
          <img
            src="/Images/cafe.jpg"
            alt="BrewNest Café ambient coffee shop with neon sign"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center space-y-2 px-4">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              About Us
            </h1>
            <p className="text-sm sm:text-base text-amber-100/90 font-medium">
              {ABOUT_DATA.heroTagline}
            </p>
          </div>
        </div>
      )}

      {/* Main Story Section matching Screen 2 */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Two-Column Story with Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left Image: Latte Art on Dark Table matching screenshot */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-amber-900/40 aspect-[4/3] bg-stone-900">
              <img
                src="/Images/Cappuccino.jpg"
                alt="Cappuccino with latte art"
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Right Story Text matching screenshot */}
            <div className="space-y-5">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1810] dark:text-[#F7EAE1] transition-colors">
                {ABOUT_DATA.storyTitle}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed transition-colors">
                {ABOUT_DATA.storyParagraph1}
              </p>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed transition-colors">
                {ABOUT_DATA.storyParagraph2}
              </p>
            </div>
          </div>

          {/* 3 Pillars matching Screen 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-[#EFE7DE] dark:bg-[#20140D] flex items-center justify-center border border-transparent dark:border-amber-900/30">
                <Clock className="w-5 h-5 text-[#8C5D3B] dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-[#F7EAE1] text-base transition-colors">
                Fresh Ingredients
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-[240px] leading-relaxed transition-colors">
                We use only the best and freshest ingredients.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-[#EFE7DE] dark:bg-[#20140D] flex items-center justify-center border border-transparent dark:border-amber-900/30">
                <Coffee className="w-5 h-5 text-[#8C5D3B] dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-[#F7EAE1] text-base transition-colors">
                Skilled Baristas
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-[240px] leading-relaxed transition-colors">
                Crafting the perfect cup, every time.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="w-12 h-12 rounded-full bg-[#EFE7DE] dark:bg-[#20140D] flex items-center justify-center border border-transparent dark:border-amber-900/30">
                <Users className="w-5 h-5 text-[#8C5D3B] dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-[#F7EAE1] text-base transition-colors">
                A Cozy Space
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-[240px] leading-relaxed transition-colors">
                Designed for comfort, connection and creativity.
              </p>
            </div>
          </div>

          {/* Quote Banner matching Screen 2 */}
          <div className="py-12 px-6 rounded-2xl bg-[#F5ECE1]/60 dark:bg-[#1C120B] border border-[#E8DACB] dark:border-amber-900/40 text-center max-w-4xl mx-auto shadow-2xs">
            <p className="font-serif italic text-lg sm:text-xl lg:text-2xl text-[#3A2216] dark:text-amber-200/90 leading-relaxed">
              {ABOUT_DATA.quote}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

