import { WaitlistEntry } from '../types';

const WAITLIST_STORAGE_KEY = 'brewnest_live_waitlist_v1';
const MY_WAITLIST_KEY = 'brewnest_my_waitlist_id';

// Default mock initial live queue simulating a bustling café service
const INITIAL_QUEUE: WaitlistEntry[] = [
  {
    id: 'wl-101',
    queueNumber: 1,
    guestName: 'Arjun M.',
    phone: '+91 98111 •••••',
    partySize: 2,
    seatingZone: 'Window View',
    joinedAt: Date.now() - 12 * 60 * 1000,
    estimatedWaitMinutes: 3,
    status: 'waiting',
  },
  {
    id: 'wl-102',
    queueNumber: 2,
    guestName: 'Priya & Ritesh',
    phone: '+91 98222 •••••',
    partySize: 4,
    seatingZone: 'Indoor Cozy',
    joinedAt: Date.now() - 7 * 60 * 1000,
    estimatedWaitMinutes: 8,
    status: 'waiting',
  },
  {
    id: 'wl-103',
    queueNumber: 3,
    guestName: 'Kunal S.',
    phone: '+91 98333 •••••',
    partySize: 1,
    seatingZone: 'Garden Patio',
    joinedAt: Date.now() - 3 * 60 * 1000,
    estimatedWaitMinutes: 14,
    status: 'waiting',
  },
];

export function getStoredWaitlist(): WaitlistEntry[] {
  if (typeof window === 'undefined') return INITIAL_QUEUE;
  try {
    const raw = localStorage.getItem(WAITLIST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(INITIAL_QUEUE));
      return INITIAL_QUEUE;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(INITIAL_QUEUE));
      return INITIAL_QUEUE;
    }
    return parsed;
  } catch (e) {
    return INITIAL_QUEUE;
  }
}

export function saveStoredWaitlist(queue: WaitlistEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent('brewnest_waitlist_updated', { detail: queue }));
  } catch (e) {
    console.error('Failed to save waitlist:', e);
  }
}

export function getMyWaitlistId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(MY_WAITLIST_KEY);
}

export function setMyWaitlistId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(MY_WAITLIST_KEY, id);
  } else {
    localStorage.removeItem(MY_WAITLIST_KEY);
  }
}

// Join the live waitlist
export function joinWaitlist(params: {
  guestName: string;
  phone: string;
  partySize: number;
  seatingZone: string;
}): WaitlistEntry {
  const currentQueue = getStoredWaitlist();
  
  // Calculate next queue number
  const maxNumber = currentQueue.reduce((max, item) => Math.max(max, item.queueNumber), 0);
  const queueNumber = maxNumber + 1;
  
  // Average turnaround time calculation (e.g. 5-7 mins per party ahead)
  const waitingAhead = currentQueue.filter((item) => item.status === 'waiting').length;
  const estimatedWaitMinutes = Math.max(4, (waitingAhead + 1) * 6);

  const newEntry: WaitlistEntry = {
    id: `wl-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    queueNumber,
    guestName: params.guestName,
    phone: params.phone,
    partySize: params.partySize,
    seatingZone: params.seatingZone,
    joinedAt: Date.now(),
    estimatedWaitMinutes,
    status: 'waiting',
  };

  const updated = [...currentQueue, newEntry];
  saveStoredWaitlist(updated);
  setMyWaitlistId(newEntry.id);
  return newEntry;
}

// Update waitlist entry status (e.g. when table becomes ready or seated)
export function updateWaitlistStatus(
  id: string,
  status: 'waiting' | 'ready' | 'seated' | 'cancelled',
  assignedTable?: string
): WaitlistEntry | null {
  const currentQueue = getStoredWaitlist();
  let updatedEntry: WaitlistEntry | null = null;

  const nextQueue = currentQueue.map((item) => {
    if (item.id === id) {
      updatedEntry = {
        ...item,
        status,
        assignedTable: assignedTable || item.assignedTable || (status === 'ready' ? `Table #${Math.floor(Math.random() * 14) + 1}` : undefined),
      };
      return updatedEntry;
    }
    return item;
  });

  saveStoredWaitlist(nextQueue);
  return updatedEntry;
}

// Leave / Cancel spot in waitlist
export function leaveWaitlist(id: string): void {
  const currentQueue = getStoredWaitlist();
  const nextQueue = currentQueue.filter((item) => item.id !== id);
  saveStoredWaitlist(nextQueue);
  if (getMyWaitlistId() === id) {
    setMyWaitlistId(null);
  }
}
