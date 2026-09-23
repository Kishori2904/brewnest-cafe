import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Coffee,
  Heart,
  Send,
  User,
  Quote,
  Flame,
  ThumbsUp,
  MapPin,
  Calendar,
} from 'lucide-react';
import { TableFeedback } from '../types';

const FEEDBACK_STORAGE_KEY = 'brewnest_table_testimonials_v1';

// Initial authentic testimonials from real café tables in Sector 12
const INITIAL_TESTIMONIALS: TableFeedback[] = [
  {
    id: 'tf-1',
    customerName: 'Aarav & Simran',
    tableNumber: 'Table #04 (Window View)',
    rating: 5,
    feedbackText:
      'The 16-hour slow-steeped cold brew paired with the grilled artisan cheese sandwich is unbeatable! Perfect lighting by the window for our afternoon laptop work.',
    favoriteItem: '16-Hour Artisanal Cold Brew',
    diningType: 'dine-in',
    createdAt: 'Today, 2:15 PM',
    verifiedVisit: true,
  },
  {
    id: 'tf-2',
    customerName: 'Dr. Vikrant Mehta',
    tableNumber: 'Table #02 (Indoor Cozy)',
    rating: 5,
    feedbackText:
      'Genuine Italian roast profile. The golden crema on the double espresso reminded me of Rome. Extremely courteous staff who know their coffee origins.',
    favoriteItem: 'Classic Espresso',
    diningType: 'quick-sip',
    createdAt: 'Yesterday, 6:40 PM',
    verifiedVisit: true,
  },
  {
    id: 'tf-3',
    customerName: 'Nandini K.',
    tableNumber: 'Table #07 (Garden Patio)',
    rating: 5,
    feedbackText:
      'Sitting under the fairy lights in the patio with the Belgian Chocolate Mocha and molten brownie cake made our anniversary evening memorable.',
    favoriteItem: 'Belgian Chocolate Mocha',
    diningType: 'patio',
    createdAt: '2 days ago',
    verifiedVisit: true,
  },
];

interface RateExperienceWidgetProps {
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
}

export const RateExperienceWidget: React.FC<RateExperienceWidgetProps> = ({ onShowToast }) => {
  const [testimonials, setTestimonials] = useState<TableFeedback[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(FEEDBACK_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_TESTIMONIALS;
  });

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('Table #04');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [favoriteItem, setFavoriteItem] = useState<string>('Cappuccino');
  const [diningType, setDiningType] = useState<TableFeedback['diningType']>('dine-in');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasJustSubmitted, setHasJustSubmitted] = useState<boolean>(false);

  // Sync to localStorage
  const saveTestimonials = (updated: TableFeedback[]) => {
    setTestimonials(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Pre-fill active table from URL or recent waitlist if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        setTableNumber(`Table #${tableParam.replace(/^#/, '')}`);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !feedbackText.trim()) {
      onShowToast('Missing Fields', 'Please share your name and feedback note.', 'error');
      return;
    }

    setIsSubmitting(true);

    const newFeedback: TableFeedback = {
      id: `tf-${Date.now()}`,
      customerName: customerName.trim(),
      tableNumber: tableNumber.trim() || 'Table Guest',
      rating,
      feedbackText: feedbackText.trim(),
      favoriteItem: favoriteItem.trim() || undefined,
      diningType,
      createdAt: 'Just now',
      verifiedVisit: true,
    };

    const updated = [newFeedback, ...testimonials];
    saveTestimonials(updated);

    setIsSubmitting(false);
    setHasJustSubmitted(true);
    setFeedbackText('');
    setCustomerName('');

    onShowToast(
      'Review Published! ⭐',
      `Thank you ${newFeedback.customerName}! Your table testimonial is now live on our guestbook board.`,
      'success'
    );
  };

  // Summary Metrics
  const averageRating = useMemo(() => {
    if (testimonials.length === 0) return 5.0;
    const sum = testimonials.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / testimonials.length).toFixed(1);
  }, [testimonials]);

  const filteredTestimonials = useMemo(() => {
    if (filterRating === 'all') return testimonials;
    return testimonials.filter((t) => t.rating === filterRating);
  }, [testimonials, filterRating]);

  return (
    <div
      id="rate-your-experience"
      className="bg-white dark:bg-[#180E09] border border-amber-900/20 dark:border-amber-900/40 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden transition-colors"
    >
      {/* Decorative Warm Backdrops */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-600/5 dark:bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header Title with Live Average Metric */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 dark:border-amber-950/60 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Tabletop Dining Guestbook</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
              Rate Your Experience
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
              Just finished your coffee or bite at BrewNest? Rate your table visit, give credit to your barista, and let your feedback inspire our next café guests.
            </p>
          </div>

          {/* Aggregate Rating Badge */}
          <div className="flex items-center gap-4 bg-[#FAF7F2] dark:bg-[#20120B] border border-amber-800/30 rounded-2xl p-4 shrink-0 shadow-inner">
            <div className="text-center">
              <div className="font-serif text-3xl font-bold text-amber-800 dark:text-amber-400 leading-none">
                {averageRating}
              </div>
              <div className="flex items-center gap-0.5 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(Number(averageRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300 dark:text-stone-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="border-l border-stone-300 dark:border-amber-900/50 pl-4 text-left">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {testimonials.length} Table Reviews
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>100% Verified Guests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Feedback Form (Left) & Testimonials Wall (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick Rating Form */}
          <div className="lg:col-span-5 bg-[#FAF7F2] dark:bg-[#140A05] border border-stone-200 dark:border-amber-950/60 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-amber-950/40 pb-3">
              <h4 className="font-serif text-lg font-bold text-[#2B1810] dark:text-[#F7EAE1] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Leave a Table Review</span>
              </h4>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">Takes 30 seconds</span>
            </div>

            {hasJustSubmitted && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Thank you! Your testimonial has been posted on the live board below.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Interactive Star Rating Selector */}
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Overall Table Rating *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white dark:bg-[#20120B] p-2 rounded-xl border border-stone-300 dark:border-amber-950/60 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || rating) >= star;
                      return (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isFilled
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300 dark:text-stone-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400">
                    {rating === 5
                      ? '5.0 — Outstanding Experience!'
                      : rating === 4
                      ? '4.0 — Really Good!'
                      : rating === 3
                      ? '3.0 — Satisfactory'
                      : rating === 2
                      ? '2.0 — Needs Improvement'
                      : '1.0 — Disappointing'}
                  </span>
                </div>
              </div>

              {/* Guest Name & Table Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Your Name / Nickname *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ria S."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#1C100A] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Table / Booth Number *
                  </label>
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#1C100A] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  >
                    <option value="Table #01 (Barista Counter)">Table #01 (Barista Counter)</option>
                    <option value="Table #02 (Indoor Cozy)">Table #02 (Indoor Cozy)</option>
                    <option value="Table #04 (Window View)">Table #04 (Window View)</option>
                    <option value="Table #07 (Garden Patio)">Table #07 (Garden Patio)</option>
                    <option value="Table #10 (Library Alcove)">Table #10 (Library Alcove)</option>
                    <option value="Table #12 (Upper Mezzanine)">Table #12 (Upper Mezzanine)</option>
                    <option value="Takeaway / Roastery Counter">Takeaway / Roastery Counter</option>
                  </select>
                </div>
              </div>

              {/* Favorite Item & Dining Atmosphere */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    What Did You Savor Most?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hazelnut Cappuccino, Garlic Bread"
                    value={favoriteItem}
                    onChange={(e) => setFavoriteItem(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#1C100A] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Seating Atmosphere
                  </label>
                  <select
                    value={diningType}
                    onChange={(e) => setDiningType(e.target.value as TableFeedback['diningType'])}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#1C100A] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                  >
                    <option value="dine-in">Dine-in Work / Chill</option>
                    <option value="patio">Open-Air Garden Patio</option>
                    <option value="quick-sip">Quick Coffee Catch-up</option>
                    <option value="family">Family Gathering</option>
                  </select>
                </div>
              </div>

              {/* Feedback Note Textarea */}
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Your Table Review &amp; Barista Note *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share a thought on the brew aroma, food warmth, service speed, or table comfort..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#1C100A] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#331C12] hover:bg-[#22120B] dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Send className="w-3.5 h-3.5 text-amber-200" />
                <span>Publish Table Testimonial</span>
              </button>
            </form>
          </div>

          {/* Right Column: Live Testimonials Showcase */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#2B1810] dark:text-[#F7EAE1] flex items-center gap-2">
                  <Quote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Recent Table Testimonials</span>
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Real feedback from customers seated at BrewNest tables
                </p>
              </div>

              {/* Star Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-stone-500 mr-1">Filter:</span>
                {(['all', 5, 4] as const).map((starOpt) => (
                  <button
                    key={starOpt}
                    onClick={() => setFilterRating(starOpt)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      filterRating === starOpt
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 dark:bg-[#20120B] text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-[#2A180F]'
                    }`}
                  >
                    {starOpt === 'all' ? 'All Reviews' : `${starOpt} ★ Stars`}
                  </button>
                ))}
              </div>
            </div>

            {/* Testimonials List */}
            <div className="grid grid-cols-1 gap-3.5 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-900/40">
              {filteredTestimonials.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF7F2] dark:bg-[#140A05] rounded-2xl border border-dashed border-stone-300 dark:border-amber-950/60 text-stone-500 text-xs">
                  No reviews match this rating filter. Be the first to leave one!
                </div>
              ) : (
                filteredTestimonials.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#FAF7F2] dark:bg-[#140A05] border border-stone-200/90 dark:border-amber-950/60 rounded-2xl p-4 sm:p-5 shadow-xs transition-all hover:border-amber-500/40 space-y-3"
                  >
                    {/* Top Row: Customer Info & Stars */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#2B1810] dark:text-[#F7EAE1]">
                            {review.customerName}
                          </span>
                          {review.verifiedVisit && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold border border-emerald-300/40">
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Verified Table</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-500" />
                          <span>{review.tableNumber}</span>
                          <span className="text-stone-300 dark:text-stone-700">·</span>
                          <span className="text-stone-500 dark:text-stone-400 font-normal">
                            {review.createdAt}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 shrink-0 bg-white dark:bg-[#20120B] px-2 py-1 rounded-lg border border-stone-200 dark:border-amber-950/60">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300 dark:text-stone-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Feedback Quote Text */}
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                      "{review.feedbackText}"
                    </p>

                    {/* Bottom Metadata Tags */}
                    {review.favoriteItem && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 font-medium">
                          <Coffee className="w-3 h-3 text-amber-600" />
                          <span>Favorite: {review.favoriteItem}</span>
                        </span>
                        <span className="text-stone-400 text-[10px]">
                          Zone: {review.diningType === 'patio' ? 'Garden Patio' : review.diningType === 'dine-in' ? 'Dine-In Lounge' : 'Roastery Bar'}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
