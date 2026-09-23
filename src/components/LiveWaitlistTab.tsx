import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  Sparkles,
  Phone,
  User,
  Coffee,
  X,
  Flame,
  ArrowRight,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { WaitlistEntry } from '../types';
import {
  getStoredWaitlist,
  joinWaitlist,
  getMyWaitlistId,
  setMyWaitlistId,
  updateWaitlistStatus,
  leaveWaitlist,
} from '../utils/waitlistManager';

interface LiveWaitlistTabProps {
  onShowToast?: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  onTableReadyNavigate?: (tableNumber: string) => void;
}

export const LiveWaitlistTab: React.FC<LiveWaitlistTabProps> = ({
  onShowToast,
  onTableReadyNavigate,
}) => {
  const [queue, setQueue] = useState<WaitlistEntry[]>(() => getStoredWaitlist());
  const [myEntryId, setMyEntryId] = useState<string | null>(() => getMyWaitlistId());

  // Join form state
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [seatingZone, setSeatingZone] = useState('Any First Available');
  const [specialNeed, setSpecialNeed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with local events and interval
  useEffect(() => {
    const handleUpdate = () => {
      setQueue(getStoredWaitlist());
      setMyEntryId(getMyWaitlistId());
    };

    window.addEventListener('brewnest_waitlist_updated', handleUpdate);
    return () => window.removeEventListener('brewnest_waitlist_updated', handleUpdate);
  }, []);

  // Look up user's active spot
  const myEntry = queue.find((item) => item.id === myEntryId);

  // Calculate my position in line
  const waitingParties = queue.filter((item) => item.status === 'waiting');
  const myPosition = myEntry
    ? waitingParties.findIndex((item) => item.id === myEntry.id) + 1
    : 0;

  // Simulate automated queue progression & notification when spot is ready
  useEffect(() => {
    if (!myEntry || myEntry.status !== 'waiting') return;

    // After joining or if timer runs, simulate staff assigning a table (e.g. 18 seconds for demo or fast preview)
    const timer = setTimeout(() => {
      const assigned = `Table #${Math.floor(Math.random() * 12) + 1}`;
      const updated = updateWaitlistStatus(myEntry.id, 'ready', assigned);
      if (updated) {
        setQueue(getStoredWaitlist());
        if (onShowToast) {
          onShowToast(
            '🎉 Your Table is Ready!',
            `${assigned} (${updated.seatingZone}) is prepared for ${updated.guestName}. Please head to the host counter within 10 minutes.`,
            'success'
          );
        }
      }
    }, 15000); // 15 seconds demo timer so the user actually experiences the live toast without waiting 15 real minutes

    return () => clearTimeout(timer);
  }, [myEntry?.id, myEntry?.status, onShowToast]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const partyNum = parseInt(partySize, 10) || 2;
    const entry = joinWaitlist({
      guestName: guestName.trim(),
      phone: phone.trim(),
      partySize: partyNum,
      seatingZone,
    });

    setQueue(getStoredWaitlist());
    setMyEntryId(entry.id);
    setIsSubmitting(false);

    if (onShowToast) {
      onShowToast(
        'Added to Live Waitlist! 📋',
        `Queue #${entry.queueNumber} · Est. wait ~${entry.estimatedWaitMinutes} mins. We will notify you here as soon as your table is ready.`,
        'info'
      );
    }
  };

  const handleSimulateReadyNow = () => {
    if (!myEntry) return;
    const assigned = `Table #${Math.floor(Math.random() * 12) + 1}`;
    const updated = updateWaitlistStatus(myEntry.id, 'ready', assigned);
    if (updated) {
      setQueue(getStoredWaitlist());
      if (onShowToast) {
        onShowToast(
          '🎉 Your Table is Ready!',
          `${assigned} is now prepared for ${updated.guestName}! Host stand notified.`,
          'success'
        );
      }
    }
  };

  const handleLeaveWaitlist = () => {
    if (!myEntryId) return;
    leaveWaitlist(myEntryId);
    setMyEntryId(null);
    setQueue(getStoredWaitlist());
    if (onShowToast) {
      onShowToast('Left Waitlist', 'Your spot has been released.', 'info');
    }
  };

  const handleMarkSeated = () => {
    if (!myEntryId) return;
    const assigned = myEntry?.assignedTable || 'Table #04';
    updateWaitlistStatus(myEntryId, 'seated', assigned);
    setMyEntryId(null);
    setQueue(getStoredWaitlist());
    if (onShowToast) {
      onShowToast(
        'Welcome & Enjoy your Brew! ☕',
        `Checked in at ${assigned}. Digital menu is active at your fingertips.`,
        'success'
      );
    }
    if (onTableReadyNavigate) {
      onTableReadyNavigate(assigned);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Café Rush Status Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 dark:from-amber-950/60 dark:to-stone-950 border border-amber-800/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>Live Host Stand</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            </div>
            <div className="text-stone-700 dark:text-stone-300 font-medium">
              Sector 12 Café Seating: <span className="font-semibold text-amber-700 dark:text-amber-400">Peak Service Rush</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 divide-x divide-stone-300 dark:divide-amber-900/50 text-stone-600 dark:text-stone-400 text-[11px]">
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-200">
              {waitingParties.length} {waitingParties.length === 1 ? 'Party' : 'Parties'}
            </div>
            <div>Waiting in Line</div>
          </div>
          <div className="pl-4">
            <div className="font-bold text-emerald-700 dark:text-emerald-400">
              ~{waitingParties.length === 0 ? 5 : waitingParties.length * 6} mins
            </div>
            <div>Average Wait</div>
          </div>
        </div>
      </div>

      {/* Conditional: Either User Is Already in Queue OR Show Join Form */}
      {myEntry ? (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Active Ticket Card */}
          <div
            className={`rounded-2xl p-5 sm:p-6 border text-left space-y-4 shadow-lg transition-all ${
              myEntry.status === 'ready'
                ? 'bg-gradient-to-br from-emerald-950/80 via-emerald-900/60 to-stone-950 border-emerald-500/60 text-white ring-2 ring-emerald-500/40'
                : 'bg-[#FAF7F2] dark:bg-[#150C07] border-amber-500/40 text-stone-800 dark:text-stone-200'
            }`}
          >
            {/* Status Header */}
            <div className="flex items-start justify-between gap-3 border-b pb-4 border-stone-200 dark:border-amber-900/40">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                  {myEntry.status === 'ready' ? (
                    <>
                      <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
                      <span className="text-emerald-300 font-bold">READY TO BE SEATED</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                      <span>LIVE QUEUE STATUS</span>
                    </>
                  )}
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold">
                  {myEntry.status === 'ready'
                    ? `${myEntry.assignedTable || 'Table Ready'} Is Waiting For You!`
                    : `Position #${myPosition} in Line`}
                </h4>
              </div>

              {/* Big Queue Number Badge */}
              <div className="text-center bg-[#FAF2EB] dark:bg-[#20120B] border border-amber-600/40 px-3.5 py-2 rounded-xl shrink-0">
                <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
                  Queue Ticket
                </div>
                <div className="font-mono text-2xl font-black text-amber-800 dark:text-amber-400">
                  #{myEntry.queueNumber}
                </div>
              </div>
            </div>

            {/* Live Progress / Callout */}
            {myEntry.status === 'ready' ? (
              <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Host Stand Alert: Table Disinfected & Ready</span>
                </div>
                <p className="text-stone-200 text-[11px] leading-relaxed">
                  Please show this digital ticket to our host at the front entrance of BrewNest. Your assigned table is{' '}
                  <strong className="text-emerald-300">{myEntry.assignedTable}</strong>.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={handleMarkSeated}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Check In / We Are Seated</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleLeaveWaitlist}
                    className="px-3 py-2 bg-stone-800/80 hover:bg-stone-700 text-stone-300 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Release Table
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-600 dark:text-stone-400">
                      Ahead of you: <strong className="text-amber-700 dark:text-amber-400">{Math.max(0, myPosition - 1)} party</strong>
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      Est. wait ~{Math.max(2, myPosition * 5)} mins
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.min(95, Math.max(15, 100 - (myPosition - 1) * 30))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Queue Details List */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                  <div className="bg-white/70 dark:bg-[#1D1009] p-2.5 rounded-lg border border-stone-200 dark:border-amber-950/60">
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">Guest Name</div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100 truncate">{myEntry.guestName}</div>
                  </div>
                  <div className="bg-white/70 dark:bg-[#1D1009] p-2.5 rounded-lg border border-stone-200 dark:border-amber-950/60">
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">Party Size</div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100">{myEntry.partySize} Guests</div>
                  </div>
                  <div className="bg-white/70 dark:bg-[#1D1009] p-2.5 rounded-lg border border-stone-200 dark:border-amber-950/60 col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">Zone Requested</div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100">{myEntry.seatingZone}</div>
                  </div>
                </div>

                {/* Simulation Shortcut for Testing & Instant Delight */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 dark:border-amber-900/40">
                  <button
                    onClick={handleSimulateReadyNow}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-800/50 transition-all cursor-pointer"
                    title="Simulate host stand freeing up a table right now"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Fast-Forward: Table Ready Now</span>
                  </button>

                  <button
                    onClick={handleLeaveWaitlist}
                    className="text-stone-500 hover:text-red-500 dark:text-stone-400 dark:hover:text-red-400 text-xs transition-colors cursor-pointer"
                  >
                    Cancel Spot
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Join Live Waitlist Form */
        <form onSubmit={handleJoin} className="space-y-4 text-xs">
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
                  placeholder="e.g. Rahul Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Mobile Number (for SMS &amp; Toast) *
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Party Size *
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
              >
                <option value="1">1 Person (Solo Seating)</option>
                <option value="2">2 People (Cozy Table)</option>
                <option value="3">3 People</option>
                <option value="4">4 People (Family/Friends)</option>
                <option value="5">5 People</option>
                <option value="6">6+ Large Group</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Preferred Seating Area
              </label>
              <select
                value={seatingZone}
                onChange={(e) => setSeatingZone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
              >
                <option value="Any First Available">⚡ Any First Available (Fastest)</option>
                <option value="Window View">Window View</option>
                <option value="Indoor Cozy">Indoor Cozy Roastery</option>
                <option value="Garden Patio">Outdoor Garden Patio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Host Stand Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Need high chair, study laptop socket, quiet corner"
              value={specialNeed}
              onChange={(e) => setSpecialNeed(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-amber-950/60 bg-white dark:bg-[#120A06] text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-700 dark:focus:ring-amber-400 focus:border-amber-700"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Users className="w-4 h-4 text-amber-200" />
              <span>Join Live Waitlist Now</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 pt-1">
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>You will receive an in-app toast banner and sound alert when your table is cleaned &amp; ready</span>
          </div>
        </form>
      )}

      {/* Live Queue Board Preview */}
      <div className="pt-2 border-t border-stone-200 dark:border-amber-950/60">
        <div className="flex items-center justify-between pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Current Waitlist Queue</span>
          </div>
          <span className="text-[11px] text-stone-500">Live Host Roster</span>
        </div>

        <div className="space-y-2">
          {queue.slice(0, 4).map((entry, index) => {
            const isMe = entry.id === myEntryId;
            return (
              <div
                key={entry.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  isMe
                    ? 'bg-amber-100/90 dark:bg-amber-950/70 border-amber-400 text-amber-950 dark:text-amber-200 font-bold'
                    : 'bg-stone-50 dark:bg-[#170E08] border-stone-200 dark:border-amber-950/40 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isMe
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    #{entry.queueNumber}
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>{entry.guestName}</span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-stone-950 font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">
                      {entry.partySize} Guests · {entry.seatingZone}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {entry.status === 'ready' ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300/40">
                      Ready ({entry.assignedTable || 'Table'})
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>~{entry.estimatedWaitMinutes}m</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
