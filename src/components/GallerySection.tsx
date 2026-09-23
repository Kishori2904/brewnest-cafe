import React, { useState, useMemo } from 'react';
import { Sparkles, Image as ImageIcon, Palette, Filter, Eye } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/cafeData';
import { GalleryItem } from '../types';
import { GalleryLightbox } from './GalleryLightbox';

interface GallerySectionProps {
  showHeaderBanner?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ showHeaderBanner = true }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'photo' | 'vector'>('photo');

  const categories = ['All', 'Ambience', 'Coffee', 'Food', 'Desserts', 'Workspace'];

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#120A06] transition-colors duration-300">
      {/* Top Banner */}
      {showHeaderBanner && (
        <div className="relative h-64 sm:h-72 lg:h-80 flex items-center justify-center bg-[#1A0E08] overflow-hidden">
          <img
            src="/Images/visual.jpg"
            alt="Dark roasted coffee beans"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 text-center space-y-2 px-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Visual Showcase</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Café Gallery
            </h1>
            <p className="text-sm sm:text-base text-amber-100/90 font-medium">
              Moments, Fresh Food, Specialty Brews &amp; Cozy Vibes
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs & Image Style Controls */}
      <section className="pt-10 pb-6 border-b border-stone-200/60 dark:border-amber-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? GALLERY_ITEMS.length
                    : GALLERY_ITEMS.filter((i) => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#2B1810] dark:bg-amber-500 text-amber-200 dark:text-stone-950 shadow-sm'
                        : 'bg-stone-200/80 dark:bg-[#20140D] hover:bg-stone-300 dark:hover:bg-[#2C1C13] text-stone-700 dark:text-stone-300 border border-transparent dark:border-amber-950/40'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="ml-1.5 text-[10px] opacity-75 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle: Real Photography vs Handcrafted Vector Art */}
            <div className="flex items-center p-1 bg-stone-200/90 dark:bg-[#20140D] rounded-full text-xs font-medium text-stone-700 dark:text-stone-300 border border-transparent dark:border-amber-900/30">
              <button
                onClick={() => setViewMode('photo')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === 'photo'
                    ? 'bg-white dark:bg-amber-500 text-stone-900 dark:text-stone-950 shadow-xs font-bold'
                    : 'hover:text-stone-950 dark:hover:text-stone-100'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-800 dark:text-stone-950" />
                <span>Photos</span>
              </button>

              <button
                onClick={() => setViewMode('vector')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                  viewMode === 'vector'
                    ? 'bg-white dark:bg-amber-500 text-stone-900 dark:text-stone-950 shadow-xs font-bold'
                    : 'hover:text-stone-950 dark:hover:text-stone-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-amber-700 dark:text-stone-950" />
                <span>Vector Art</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Gallery Images */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const displaySrc =
                viewMode === 'vector' && item.vectorAsset ? item.vectorAsset : item.image;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-900 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-stone-200/80 dark:border-amber-900/40 flex flex-col justify-end"
                >
                  <img
                    src={displaySrc}
                    alt={item.alt}
                    onError={(e) => {
                      // Fallback to local vector illustration if remote photo fails
                      if (item.vectorAsset && e.currentTarget.src !== item.vectorAsset) {
                        e.currentTarget.src = item.vectorAsset;
                      }
                    }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top-Right Badge: Category & View Mode */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide border border-white/20">
                      {item.category}
                    </span>
                  </div>

                  {/* Gradient Overlay & Details */}
                  <div className="relative z-10 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-200 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-base truncate">
                        {item.title}
                      </h3>
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Lightbox for Zoomable Image Details */}
      <GalleryLightbox
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};
