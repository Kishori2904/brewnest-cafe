import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, ShieldAlert, Copy, Check, Navigation, Car, Footprints, ExternalLink, Sparkles } from 'lucide-react';
import { BUSINESS_INFO, LANDMARK_DISTANCES } from '../data/cafeData';

interface BusinessInfoSectionProps {
  onShowToast: (title: string, description?: string) => void;
}

export const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ onShowToast }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeLandmarkIndex, setActiveLandmarkIndex] = useState(0);
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Determine open/closed status based on Indian Standard Time (UTC+5:30)
  useEffect(() => {
    try {
      const now = new Date();
      // UTC time + 5.5 hours
      const istTime = new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60000);
      const hours = istTime.getHours();
      // Open between 8:00 AM (8) and 11:00 PM (23)
      setIsOpenNow(hours >= 8 && hours < 23);
    } catch (e) {
      setIsOpenNow(true);
    }
  }, []);

  const handleCopy = (key: string, value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    onShowToast(`Copied ${label}`, value);
  };

  const selectedLandmark = LANDMARK_DISTANCES[activeLandmarkIndex];

  return (
    <section id="info" className="py-16 sm:py-24 bg-[#FAF7F2] dark:bg-[#120A06] border-b border-stone-200 dark:border-amber-950/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-semibold border border-amber-300/60 dark:border-amber-800/50">
            <MapPin className="w-3.5 h-3.5" />
            <span>Greater Noida Neighborhood Hub</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#29170E] dark:text-[#F7EAE1] tracking-tight">
            Location, Hours &amp; Transit Routes
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Conveniently situated in Greater Noida, Uttar Pradesh, close to academic campuses and expressway corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Live Status (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Live Open / Closed Status Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#190F09] border border-stone-200 dark:border-amber-950/50 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isOpenNow ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      isOpenNow ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                </span>
                <div>
                  <strong className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                    {isOpenNow ? 'Café Open Now (Demo Schedule)' : 'Currently Closed · Opens 8:00 AM IST'}
                  </strong>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Live schedule based on Greater Noida Local Time (IST)
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/40">
                8:00 AM – 11:00 PM
              </span>
            </div>

            {/* Address Card with Copy */}
            <div className="p-5 bg-white dark:bg-[#190F09] rounded-2xl border border-stone-200 dark:border-amber-950/50 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-900 dark:text-amber-300 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      Business Address
                    </h3>
                    <p className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      {BUSINESS_INFO.address}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy('address', BUSINESS_INFO.address, 'Address')}
                  className="p-2 text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-[#2A1B12] transition-colors cursor-pointer"
                  title="Copy address"
                  aria-label="Copy address"
                >
                  {copiedKey === 'address' ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-amber-950/30 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>District: Gautam Buddha Nagar, Uttar Pradesh</span>
                <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/40">
                  Greater Noida Hub
                </span>
              </div>
            </div>

            {/* Opening Hours Card with Copy */}
            <div className="p-5 bg-white dark:bg-[#190F09] rounded-2xl border border-stone-200 dark:border-amber-950/50 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-900 dark:text-amber-300 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      Operating Hours
                    </h3>
                    <p className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      {BUSINESS_INFO.openingHours}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy('hours', BUSINESS_INFO.openingHours, 'Hours')}
                  className="p-2 text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-100 rounded-lg hover:bg-stone-100 dark:hover:bg-[#2A1B12] transition-colors cursor-pointer"
                  title="Copy hours"
                  aria-label="Copy hours"
                >
                  {copiedKey === 'hours' ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-amber-950/30 grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300">
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-100">Mon – Fri:</span> {BUSINESS_INFO.openingHours}
                </div>
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-100">Sat – Sun:</span> {BUSINESS_INFO.openingHours}
                </div>
              </div>
            </div>

            {/* Phone & Email Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="p-5 bg-white dark:bg-[#190F09] rounded-2xl border border-stone-200 dark:border-amber-950/50 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-900 dark:text-amber-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <button
                    onClick={() => handleCopy('phone', BUSINESS_INFO.phone, 'Phone')}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
                    title="Copy phone"
                  >
                    {copiedKey === 'phone' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Phone
                </div>
                <div className="font-mono text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
                  {BUSINESS_INFO.phone}
                </div>
              </div>

              {/* Email */}
              <div className="p-5 bg-white dark:bg-[#190F09] rounded-2xl border border-stone-200 dark:border-amber-950/50 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-900 dark:text-amber-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <button
                    onClick={() => handleCopy('email', BUSINESS_INFO.email, 'Email')}
                    className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
                    title="Copy email"
                  >
                    {copiedKey === 'email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Email
                </div>
                <div className="font-mono text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
                  {BUSINESS_INFO.email}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Greater Noida Commute & Landmark Calculator (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white dark:bg-[#190F09] rounded-3xl border border-stone-200 dark:border-amber-950/50 overflow-hidden shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-amber-950/30 pb-3">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Interactive Transit &amp; Landmark Estimator</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">Greater Noida Map</span>
              </div>

              {/* Landmark Selection Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block">
                  Select your starting point in Greater Noida:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANDMARK_DISTANCES.map((item, idx) => {
                    const isSelected = activeLandmarkIndex === idx;
                    return (
                      <button
                        key={item.name}
                        onClick={() => setActiveLandmarkIndex(idx)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#331C12] dark:bg-amber-500 text-amber-200 dark:text-stone-950 border-[#331C12] dark:border-amber-500 shadow-2xs'
                            : 'bg-stone-50 dark:bg-[#251710] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-amber-950/40 hover:bg-stone-100 dark:hover:bg-[#332017]'
                        }`}
                      >
                        <strong className="block text-xs truncate font-bold">{item.name.split(' ')[0]} {item.name.split(' ')[1]}</strong>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-amber-300 dark:text-stone-900 font-semibold' : 'text-stone-500 dark:text-stone-400'}`}>
                          {item.distance} · {item.driveTime}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Landmark Details Box */}
              <div className="p-4 bg-[#FAF7F2] dark:bg-[#120A06] rounded-2xl border border-stone-200 dark:border-amber-950/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                      {selectedLandmark.landmarkType}
                    </span>
                    <h4 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      {selectedLandmark.name}
                    </h4>
                  </div>
                  <span className="text-sm font-serif font-bold text-stone-800 dark:text-stone-200 bg-white dark:bg-[#190F09] px-2.5 py-1 rounded-lg border border-stone-200 dark:border-amber-950/40 shadow-2xs">
                    {selectedLandmark.distance}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-2.5 bg-white dark:bg-[#190F09] rounded-xl border border-stone-200 dark:border-amber-950/40 flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block">DRIVING TIME</span>
                      <strong className="text-stone-900 dark:text-stone-100">{selectedLandmark.driveTime}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-[#190F09] rounded-xl border border-stone-200 dark:border-amber-950/40 flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-stone-400 block">WALKING TIME</span>
                      <strong className="text-stone-900 dark:text-stone-100">{selectedLandmark.walkTime}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
                  <strong>Barista Tip:</strong> {selectedLandmark.tip}
                </p>
              </div>

              {/* Greater Noida Map Graphic */}
              <div className="relative h-44 bg-[#E8E1D5] dark:bg-[#251710] rounded-2xl overflow-hidden p-4 flex flex-col justify-between border border-transparent dark:border-amber-950/40">
                <svg
                  className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
                  viewBox="0 0 400 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="50" y1="0" x2="50" y2="200" stroke="#7A6856" strokeWidth="4" />
                  <line x1="200" y1="0" x2="200" y2="200" stroke="#7A6856" strokeWidth="6" />
                  <line x1="350" y1="0" x2="350" y2="200" stroke="#7A6856" strokeWidth="4" />
                  <line x1="0" y1="70" x2="400" y2="70" stroke="#7A6856" strokeWidth="4" />
                  <line x1="0" y1="150" x2="400" y2="150" stroke="#7A6856" strokeWidth="5" />
                  <line x1="0" y1="190" x2="400" y2="30" stroke="#C49A45" strokeWidth="6" />
                  <circle cx="200" cy="110" r="24" stroke="#7A6856" strokeWidth="4" fill="#FAF7F2" />
                </svg>

                <div className="relative z-10 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 dark:text-stone-100 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700">
                    Route from {selectedLandmark.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-stone-600 dark:text-stone-300 bg-white/80 dark:bg-stone-900/80 px-2 py-0.5 rounded font-mono">
                    28.4744° N, 77.5040° E
                  </span>
                </div>

                <div className="relative z-10 self-center flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#331C12] dark:bg-amber-500 text-amber-300 dark:text-stone-950 flex items-center justify-center shadow-lg ring-4 ring-amber-200/80 dark:ring-amber-400/40">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="bg-white/95 dark:bg-[#190F09]/95 px-2.5 py-1 rounded-xl shadow-md text-xs border border-transparent dark:border-amber-950/40">
                    <strong className="text-stone-900 dark:text-stone-100 block font-serif">BrewNest Hub</strong>
                    <span className="text-[10px] text-amber-900 dark:text-amber-400">{selectedLandmark.distance} from {selectedLandmark.name.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="relative z-10 flex justify-end">
                  <a
                    href="https://www.google.com/maps/search/Greater+Noida+Uttar+Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-950 dark:text-amber-300 bg-white/90 dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 shadow-2xs"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

