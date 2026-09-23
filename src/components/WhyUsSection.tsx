import React from 'react';
import { Coffee, Utensils, Leaf, Users } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const features = [
    {
      id: 'feature-1',
      title: 'Premium Coffee',
      description: 'Rich flavors, freshly brewed just for you.',
      icon: <Coffee className="w-6 h-6 text-[#8C5D3B]" />,
    },
    {
      id: 'feature-2',
      title: 'Delicious Food',
      description: 'From snacks to desserts, we serve happiness.',
      icon: <Utensils className="w-6 h-6 text-[#8C5D3B]" />,
    },
    {
      id: 'feature-3',
      title: 'Cozy Ambience',
      description: 'A perfect space to relax, work or catch up.',
      icon: <Leaf className="w-6 h-6 text-[#8C5D3B]" />,
    },
    {
      id: 'feature-4',
      title: 'Friendly Service',
      description: 'Our team is always here to make your visit special.',
      icon: <Users className="w-6 h-6 text-[#8C5D3B]" />,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] dark:bg-[#150D08] border-b border-stone-200/60 dark:border-amber-950/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Eyebrow & Title matching screenshot */}
        <div className="text-center space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8C5D3B] dark:text-amber-400 transition-colors">
            — WHY CHOOSE US —
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1810] dark:text-[#F7EAE1] transition-colors">
            What Makes BrewNest Special?
          </h2>
        </div>

        {/* 4 Items Grid: 4 cols on desktop, 2 cols on mobile matching Screen 1 & Screen 6 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center space-y-3 group"
            >
              {/* Circular Icon Container */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#EFE7DE] dark:bg-[#22140C] group-hover:bg-[#E5D9CB] dark:group-hover:bg-[#2E1A10] flex items-center justify-center transition-colors border border-transparent dark:border-amber-900/30 shadow-xs">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-stone-900 dark:text-[#F7EAE1] text-sm sm:text-base transition-colors">
                {feature.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-[210px] leading-relaxed transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
