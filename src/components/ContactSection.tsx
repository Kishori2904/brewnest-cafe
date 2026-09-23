import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Trash2, Coffee, Navigation } from 'lucide-react';
import { BUSINESS_INFO } from '../data/cafeData';
import { MenuItem } from '../types';
import { BrewNestMap } from './BrewNestMap';
import { TableQRShareCard } from './TableQRShareCard';
import { RateExperienceWidget } from './RateExperienceWidget';

interface ContactSectionProps {
  showHeaderBanner?: boolean;
  attachedItems?: MenuItem[];
  onClearAttachedItems?: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateToMenu?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  showHeaderBanner = true,
  attachedItems = [],
  onClearAttachedItems,
  onShowToast,
  onNavigateToMenu,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitted(true);
    onShowToast('Message Sent!', 'Thank you for reaching out to BrewNest. We will reply soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div id="contact" className="bg-[#FAF7F2] dark:bg-[#120A06] transition-colors duration-300">
      {/* Top Banner matching Screen 5 */}
      {showHeaderBanner && (
        <div className="relative h-64 sm:h-72 lg:h-80 flex items-center justify-center bg-[#1A0E08] overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}Images/contact.jpg`}
            alt="BrewNest Café ambient coffee cup and greenery"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 text-center space-y-2 px-4">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-amber-100/90 font-medium">
              We'd Love to Hear From You
            </p>
          </div>
        </div>
      )}

      {/* Main Contact Section matching Screen 5 */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Get in Touch matching Screen 5 */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                  Get in Touch
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Have a question, feedback or just want to say hello? Reach out to us — we're here for you!
                </p>
              </div>

              {/* Info Items matching Screen 5 */}
              <div className="space-y-5 pt-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#EFE7DE] dark:bg-[#20140D] flex items-center justify-center shrink-0 mt-0.5 border border-transparent dark:border-amber-900/40">
                    <MapPin className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 dark:text-[#F7EAE1]">Address</div>
                    <div className="text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                      123 Green Park, Sector 12<br />
                      Noida, Uttar Pradesh - 201301
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#EFE7DE] dark:bg-[#20140D] flex items-center justify-center shrink-0 mt-0.5 border border-transparent dark:border-amber-900/40">
                    <Phone className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 dark:text-[#F7EAE1]">Phone</div>
                    <a
                      href="tel:+919876543210"
                      className="text-stone-600 dark:text-stone-400 hover:text-[#8C5D3B] dark:hover:text-amber-300 transition-colors mt-0.5 block"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#EFE7DE] dark:bg-[#20140D] flex items-center justify-center shrink-0 mt-0.5 border border-transparent dark:border-amber-900/40">
                    <Mail className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 dark:text-[#F7EAE1]">Email</div>
                    <a
                      href="mailto:hello@brewnestcafe.com"
                      className="text-stone-600 dark:text-stone-400 hover:text-[#8C5D3B] dark:hover:text-amber-300 transition-colors mt-0.5 block"
                    >
                      hello@brewnestcafe.com
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#EFE7DE] dark:bg-[#20140D] flex items-center justify-center shrink-0 mt-0.5 border border-transparent dark:border-amber-900/40">
                    <Clock className="w-4 h-4 text-[#8C5D3B] dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 dark:text-[#F7EAE1]">Opening Hours</div>
                    <div className="text-stone-600 dark:text-stone-400 mt-0.5">
                      Mon – Sun: 8:00 AM – 11:00 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Attached Items from Tray */}
              {attachedItems.length > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-[#20140D] rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-900 dark:text-amber-300">
                      Attached Items ({attachedItems.length})
                    </span>
                    {onClearAttachedItems && (
                      <button
                        onClick={onClearAttachedItems}
                        className="text-stone-500 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {attachedItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white dark:bg-[#140C07] text-stone-700 dark:text-stone-300 rounded border border-amber-200 dark:border-amber-900/40 text-[11px]"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Send a Message Form matching Screen 5 */}
            <div className="lg:col-span-7 bg-white dark:bg-[#190F09] p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-amber-900/40 shadow-sm space-y-6">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                Send a Message
              </h3>

              {isSubmitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-300/40">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-[#F7EAE1]">
                    Thank You!
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
                    Your message has been sent to our café team. We look forward to seeing you soon at BrewNest.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-3 px-5 py-2 text-xs font-semibold text-white bg-[#2B1810] dark:bg-amber-600 hover:bg-[#1E110A] dark:hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Name field */}
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#8C5D3B] dark:focus:ring-amber-400 focus:border-[#8C5D3B] dark:focus:border-amber-400"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#8C5D3B] dark:focus:ring-amber-400 focus:border-[#8C5D3B] dark:focus:border-amber-400"
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Type your message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-[#8C5D3B] dark:focus:ring-amber-400 focus:border-[#8C5D3B] dark:focus:border-amber-400 resize-none"
                    />
                  </div>

                  {/* Send Message Button matching Screen 5 */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-[#3A1F13] dark:bg-amber-600 hover:bg-[#2A160E] dark:hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-200" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Rate Your Experience Table Guestbook & Testimonials */}
          <div className="mt-14">
            <RateExperienceWidget onShowToast={onShowToast} />
          </div>

          {/* Tabletop Digital Menu QR Code Share Feature */}
          <div className="mt-14">
            <TableQRShareCard
              variant="contact"
              onShowToast={onShowToast}
              onNavigateToMenu={onNavigateToMenu}
            />
          </div>

          {/* Interactive Google Map Section */}
          <div className="mt-16 pt-12 border-t border-stone-200/80 dark:border-amber-950/60">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C5D3B] dark:text-amber-400">
                — FIND US ON THE MAP —
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                Locate BrewNest Roastery & Café
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Explore our exact coordinates in Sector 12, Noida, navigate via GPS, or plan metro transit.
              </p>
            </div>

            <BrewNestMap />
          </div>
        </div>
      </section>
    </div>
  );
};
