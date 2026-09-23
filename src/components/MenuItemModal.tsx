import React, { useState, useEffect } from 'react';
import { X, Clock, Flame, Plus, Check, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToTrayWithOptions: (
    item: MenuItem,
    options: {
      size: string;
      milk?: string;
      sweetness?: string;
      extras: string[];
      calculatedPrice: number;
    }
  ) => void;
  isInTray: boolean;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToTrayWithOptions,
  isInTray,
}) => {
  const [selectedSize, setSelectedSize] = useState<'Regular' | 'Large'>('Regular');
  const [selectedMilk, setSelectedMilk] = useState<string>('Whole Milk');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('Standard');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [addedJustNow, setAddedJustNow] = useState(false);

  // Reset states when item changes
  useEffect(() => {
    setSelectedSize('Regular');
    setSelectedMilk('Whole Milk');
    setSelectedSweetness('Standard');
    setSelectedExtras([]);
    setAddedJustNow(false);
  }, [item]);

  if (!isOpen || !item) return null;

  const isBeverage = item.dietary === 'beverage' || item.category === 'Coffee';

  // Calculate live price based on selections
  let calculatedPrice = item.price;
  if (selectedSize === 'Large') calculatedPrice += 30;
  if (isBeverage) {
    if (selectedMilk === 'Oat Milk') calculatedPrice += 25;
    if (selectedMilk === 'Almond Milk') calculatedPrice += 30;
  }
  if (selectedExtras.includes('extra-cheese')) calculatedPrice += 30;
  if (selectedExtras.includes('extra-shot')) calculatedPrice += 35;
  if (selectedExtras.includes('meal-combo')) calculatedPrice += 45;

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const handleAdd = () => {
    onAddToTrayWithOptions(item, {
      size: selectedSize,
      milk: isBeverage ? selectedMilk : undefined,
      sweetness: isBeverage ? selectedSweetness : undefined,
      extras: selectedExtras,
      calculatedPrice,
    });
    setAddedJustNow(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-[#FAF7F2] dark:bg-[#190F09] rounded-3xl shadow-2xl border border-stone-200 dark:border-amber-900/40 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 transition-colors"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-item-title"
      >
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 bg-stone-900 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            onError={(e) => {
              if (item.vectorAsset && e.currentTarget.src !== item.vectorAsset) {
                e.currentTarget.src = item.vectorAsset;
              }
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-black/70 text-amber-200 border border-amber-500/30 font-mono">
              {item.vectorAsset || item.category}
            </span>
            <span className="text-xs font-semibold text-stone-200">
              {item.category}
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-stone-800 dark:text-stone-200">
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {item.dietary === 'veg' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" /> Vegetarian
                  </span>
                )}
                {item.dietary === 'non-veg' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" /> Non-Veg
                  </span>
                )}
                {item.isSignature && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700/60">
                    <Sparkles className="w-3 h-3 text-amber-700 dark:text-amber-400" /> Signature
                  </span>
                )}
              </div>
              <h3 id="modal-item-title" className="font-serif text-2xl font-bold text-stone-900 dark:text-[#F7EAE1] leading-tight">
                {item.name}
              </h3>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl font-bold text-amber-900 dark:text-amber-400 font-serif">₹{calculatedPrice}</span>
              <span className="block text-[10px] text-stone-500 dark:text-stone-400 font-medium">Demo Price (INR)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {item.description}
          </p>

          {/* Prep time & calories */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-white dark:bg-[#120A06] rounded-xl border border-stone-200 dark:border-amber-950/50 text-xs text-stone-700 dark:text-stone-300">
            {item.preparationTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span>Prep Time: <strong className="text-stone-900 dark:text-stone-100">{item.preparationTime}</strong></span>
              </div>
            )}
            {item.calories && (
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span>Energy: <strong className="text-stone-900 dark:text-stone-100">{item.calories}</strong></span>
              </div>
            )}
          </div>

          {/* Interactive Customization Options */}
          <div className="space-y-4 pt-1">
            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider flex items-center justify-between">
              <span>Interactive Customizer</span>
              <span className="text-[10px] font-normal text-stone-400">Updates inquiry estimate</span>
            </h4>

            {/* Size Options */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">Select Portion Size</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSize('Regular')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    selectedSize === 'Regular'
                      ? 'bg-[#331C12] text-amber-200 border-[#331C12] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-400'
                      : 'bg-white dark:bg-[#140C07] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-950/50 hover:bg-stone-50 dark:hover:bg-[#20140D]'
                  }`}
                >
                  Regular (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSize('Large')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    selectedSize === 'Large'
                      ? 'bg-[#331C12] text-amber-200 border-[#331C12] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-400'
                      : 'bg-white dark:bg-[#140C07] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-950/50 hover:bg-stone-50 dark:hover:bg-[#20140D]'
                  }`}
                >
                  Large (+₹30)
                </button>
              </div>
            </div>

            {/* Milk Options for Beverages */}
            {isBeverage && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">Milk Choice</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Whole Milk', label: 'Whole Milk', extra: '+₹0' },
                    { id: 'Oat Milk', label: 'Oat Milk', extra: '+₹25' },
                    { id: 'Almond Milk', label: 'Almond Milk', extra: '+₹30' },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setSelectedMilk(m.id)}
                      className={`p-2 rounded-xl text-[11px] font-semibold border text-center transition-all cursor-pointer ${
                        selectedMilk === m.id
                          ? 'bg-[#331C12] text-amber-200 border-[#331C12] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-400'
                          : 'bg-white dark:bg-[#140C07] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-950/50 hover:bg-stone-50 dark:hover:bg-[#20140D]'
                      }`}
                    >
                      <span className="block leading-tight">{m.label}</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">{m.extra}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sweetness for Beverages */}
            {isBeverage && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">Sweetness Level</label>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {['Standard', 'Less Sweet (50%)', 'Unsweetened (0%)'].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setSelectedSweetness(lvl)}
                      className={`p-2 rounded-xl font-semibold border text-center transition-all cursor-pointer ${
                        selectedSweetness === lvl
                          ? 'bg-[#331C12] text-amber-200 border-[#331C12] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-400'
                          : 'bg-white dark:bg-[#140C07] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-950/50 hover:bg-stone-50 dark:hover:bg-[#20140D]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extras */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">Optional Add-ons</label>
              <div className="space-y-2">
                {isBeverage ? (
                  <label
                    onClick={() => toggleExtra('extra-shot')}
                    className="flex items-center justify-between p-2.5 bg-white dark:bg-[#140C07] rounded-xl border border-stone-200 dark:border-amber-950/50 cursor-pointer text-xs hover:bg-stone-50 dark:hover:bg-[#20140D]"
                  >
                    <span className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes('extra-shot')}
                        onChange={() => {}}
                        className="rounded text-amber-900 focus:ring-amber-800"
                      />
                      <span>Extra Espresso Shot (Single Origin)</span>
                    </span>
                    <span className="font-semibold text-amber-900 dark:text-amber-400">+₹35</span>
                  </label>
                ) : (
                  <>
                    <label
                      onClick={() => toggleExtra('extra-cheese')}
                      className="flex items-center justify-between p-2.5 bg-white dark:bg-[#140C07] rounded-xl border border-stone-200 dark:border-amber-950/50 cursor-pointer text-xs hover:bg-stone-50 dark:hover:bg-[#20140D]"
                    >
                      <span className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes('extra-cheese')}
                          onChange={() => {}}
                          className="rounded text-amber-900 focus:ring-amber-800"
                        />
                        <span>Extra Mozzarella &amp; Cheddar Melt</span>
                      </span>
                      <span className="font-semibold text-amber-900 dark:text-amber-400">+₹30</span>
                    </label>

                    <label
                      onClick={() => toggleExtra('meal-combo')}
                      className="flex items-center justify-between p-2.5 bg-white dark:bg-[#140C07] rounded-xl border border-stone-200 dark:border-amber-950/50 cursor-pointer text-xs hover:bg-stone-50 dark:hover:bg-[#20140D]"
                    >
                      <span className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                        <input
                          type="checkbox"
                          checked={selectedExtras.includes('meal-combo')}
                          onChange={() => {}}
                          className="rounded text-amber-900 focus:ring-amber-800"
                        />
                        <span>Upgrade to Meal Combo (Herb Fries + Dip)</span>
                      </span>
                      <span className="font-semibold text-amber-900 dark:text-amber-400">+₹45</span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium px-2 py-0.5 bg-stone-200 dark:bg-[#251710] text-stone-700 dark:text-stone-300 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer with Live Add */}
        <div className="p-4 bg-white dark:bg-[#120A06] border-t border-stone-200 dark:border-amber-950/50 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block">Total for item:</span>
            <span className="text-xl font-serif font-bold text-stone-900 dark:text-amber-400">₹{calculatedPrice}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white dark:text-stone-950 bg-[#331C12] hover:bg-[#22120B] dark:bg-amber-500 dark:hover:bg-amber-600 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {addedJustNow ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-950" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-amber-300 dark:text-stone-950" />
                  <span>Add Customized Item (₹{calculatedPrice})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};
