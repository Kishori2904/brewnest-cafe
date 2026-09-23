import React, { useEffect, useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryLightboxProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset image error whenever a new image opens
  useEffect(() => {
    setImageError(false);
  }, [item]);

  // Close popup with Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Prevent background page scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onMouseDown={(e) => {
        // Close when clicking the dark background
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#FAF7F2] dark:bg-[#1A100A] rounded-3xl shadow-2xl border border-stone-200 dark:border-amber-900/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200 hover:scale-105 cursor-pointer"
          aria-label="Close gallery"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Preview */}
        <div className="relative bg-stone-950 flex items-center justify-center overflow-hidden min-h-[300px] max-h-[500px]">
          {!imageError ? (
            <img
              src={item.image}
              alt={item.alt}
              onError={() => setImageError(true)}
              className="w-full h-auto max-h-[500px] object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-stone-400">
              <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Image could not be loaded</p>
            </div>
          )}

          {/* Image Category */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
            {item.category}
          </div>

          {/* Image Dimensions */}
          <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md text-[11px] font-mono text-stone-300">
            {item.dimensions}
          </div>
        </div>

        {/* Information */}
        <div className="p-6 space-y-4">
          <div className="border-b border-stone-200 dark:border-amber-950/50 pb-3 pr-10">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-sm">
              {item.category}
            </span>

            <h3
              id="lightbox-title"
              className="font-serif text-2xl font-bold text-stone-900 dark:text-[#F7EAE1] mt-2"
            >
              {item.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {item.description}
          </p>

          {/* Close Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#331C12] hover:bg-[#201109] rounded-xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};