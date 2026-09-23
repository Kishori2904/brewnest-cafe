import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, CheckCircle, Sparkles, Phone, Mail, User, Coffee, Flame } from 'lucide-react';
import { BUSINESS_INFO } from '../data/cafeData';
import { LiveWaitlistTab } from './LiveWaitlistTab';

interface BookTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed?: (ticketDetails: any) => void;
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  initialTab?: 'book' | 'waitlist';
  onTableReadyNavigate?: (tableNumber: string) => void;
}

export const BookTableModal: React.FC<BookTableModalProps> = ({
  isOpen,
  onClose,
  onBookingConfirmed,
  onShowToast,
  initialTab = 'book',
  onTableReadyNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'waitlist'>(initialTab);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('18:00');
  const [guests, setGuests] = useState('2');
  const [seatingZone, setSeatingZone] = useState('Indoor Cozy');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const ref = `BN-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setIsSuccess(true);

    if (onBookingConfirmed) {
      onBookingConfirmed({
        ref,
        name,
        phone,
        email,
        date,
        time,
        guests,
        seatingZone,
      });
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#190F09] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 dark:border-amber-900/40 relative text-stone-800 dark:text-stone-200 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 bg-stone-100 dark:bg-[#2A1B12] hover:bg-stone-200 dark:hover:bg-[#382317] rounded-full transition-colors cursor-pointer z-10"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-300/40">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-800 dark:text-amber-400">
                Reservation Confirmed
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                We Look Forward to Welcoming You!
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Your table at BrewNest Café has been reserved. A confirmation SMS/Email has been queued.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-[#FAF7F2] dark:bg-[#120A06] border border-amber-200 dark:border-amber-900/40 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-amber-950/50">
                <span className="text-stone-500 dark:text-stone-400 font-medium">Booking ID:</span>
                <span className="font-mono font-bold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                  {bookingRef}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Guest Name:</span>
                <span className="font-semibold text-stone-900 dark:text-[#F7EAE1]">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Date &amp; Time:</span>
                <span className="font-semibold text-stone-900 dark:text-[#F7EAE1]">
                  {date} at {time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Party Size:</span>
                <span className="font-semibold text-stone-900 dark:text-[#F7EAE1]">{guests} Guest(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Seating Area:</span>
                <span className="font-semibold text-stone-900 dark:text-[#F7EAE1]">{seatingZone}</span>
              </div>
              <div className="flex justify-between pt-1 text-[11px] text-stone-500 dark:text-stone-400">
                <span>Address:</span>
                <span className="text-right text-stone-700 dark:text-stone-300">Sector 12, Noida</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-[#331C12] hover:bg-[#22120B] dark:bg-amber-600 dark:hover:bg-amber-700 text-amber-100 dark:text-stone-950 text-sm font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Modal Header & Navigation Tabs */}
            <div className="bg-[#FAF7F2] dark:bg-[#120A06] p-6 pb-0 border-b border-stone-200 dark:border-amber-950/50">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>BrewNest Table &amp; Queue Management</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#2B1810] dark:text-[#F7EAE1]">
                {activeTab === 'book' ? 'Reserve a Table in Advance' : 'Join Live Café Waitlist'}
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 mb-4">
                {activeTab === 'book'
                  ? 'Plan your visit ahead for dates and special occasions at Sector 12, Noida.'
                  : 'Currently at the café or on the way? Get in the virtual queue without standing at the door.'}
              </p>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 border-b border-stone-200 dark:border-amber-950/60 -mx-6 px-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('book')}
                  className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 ${
                    activeTab === 'book'
                      ? 'text-[#2B1810] dark:text-amber-300 font-bold border-b-2 border-amber-600 dark:border-amber-400'
                      : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Advance Reservation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('waitlist')}
                  className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 ${
                    activeTab === 'waitlist'
                      ? 'text-[#2B1810] dark:text-amber-300 font-bold border-b-2 border-amber-600 dark:border-amber-400'
                      : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>Join Live Waitlist</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold">
                    LIVE
                  </span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'waitlist' ? (
              <div className="p-6">
                <LiveWaitlistTab
                  onShowToast={onShowToast}
                  onTableReadyNavigate={(tbl) => {
                    if (onTableReadyNavigate) {
                      onTableReadyNavigate(tbl);
                    }
                    onClose();
                  }}
                />
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400 dark:text-stone-500" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400 dark:text-stone-500" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400 dark:text-stone-500" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Time *
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                      <option value="19:30">07:30 PM</option>
                      <option value="21:00">09:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Guests *
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5 People</option>
                      <option value="6+">6+ Group</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Seating Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Indoor Cozy', 'Window View', 'Garden Patio'].map((zone) => (
                      <button
                        type="button"
                        key={zone}
                        onClick={() => setSeatingZone(zone)}
                        className={`py-2 px-2 rounded-lg border text-center transition-colors cursor-pointer text-xs ${
                          seatingZone === zone
                            ? 'bg-[#331C12] text-amber-200 border-[#331C12] dark:bg-amber-500 dark:text-stone-950 dark:border-amber-400 font-semibold'
                            : 'bg-stone-50 dark:bg-[#20140D] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#2C1C13] border-stone-200 dark:border-amber-950/40'
                        }`}
                      >
                        {zone}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Special Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Anniversary, quiet study table, high chair needed, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#331C12] hover:bg-[#22120B] dark:bg-amber-600 dark:hover:bg-amber-700 text-amber-100 dark:text-stone-950 font-semibold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-amber-300 dark:text-stone-950" />
                    <span>Confirm Table Reservation</span>
                  </button>
                </div>

                <div className="text-[11px] text-center text-stone-500 dark:text-stone-400 pt-1">
                  Mon – Sun: 8:00 AM – 11:00 PM · Sector 12, Noida
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );

};
