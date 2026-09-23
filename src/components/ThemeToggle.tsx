import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'full';
  className?: string;
  onThemeSwitched?: (newThemeName: string) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
  onThemeSwitched,
}) => {
  const { theme, toggleTheme, setTheme, themeName, isDark } = useTheme();

  const handleToggle = () => {
    const next = theme === 'day' ? 'Evening Lounge' : 'Café Day';
    toggleTheme();
    if (onThemeSwitched) {
      onThemeSwitched(next);
    }
  };

  if (variant === 'full') {
    return (
      <div
        className={`p-3 rounded-2xl border transition-all duration-300 ${
          isDark
            ? 'bg-[#1D120B] border-amber-900/40 text-stone-200'
            : 'bg-white border-stone-200 text-stone-800'
        } ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isDark ? (
              <Moon className="w-4 h-4 text-amber-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-600" />
            )}
            <span className="text-xs font-bold font-serif">Ambience Theme</span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            {themeName}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-[#150D07] rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setTheme('day');
              onThemeSwitched?.('Café Day');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              theme === 'day'
                ? 'bg-white text-stone-900 shadow-xs font-bold border border-stone-200/60'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>Café Day</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme('night');
              onThemeSwitched?.('Evening Lounge');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              theme === 'night'
                ? 'bg-[#2B1810] text-amber-300 shadow-xs font-bold border border-amber-800/40'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>Evening Lounge</span>
          </button>
        </div>
      </div>
    );
  }

  // Compact Pill Switcher for Navbar
  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`group relative inline-flex items-center h-8 px-1 rounded-full transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-amber-500/40 border ${
        isDark
          ? 'bg-[#1F130B] border-amber-900/50 hover:border-amber-700/60 shadow-xs'
          : 'bg-stone-200/80 border-stone-300/80 hover:bg-stone-200 shadow-xs'
      } ${className}`}
      title={`Switch to ${isDark ? "Café Day (Light)" : "Evening Lounge (Dark)"}`}
      aria-label={`Current theme: ${themeName}. Click to toggle theme.`}
    >
      {/* Day Option Slot */}
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
          !isDark
            ? 'bg-white text-amber-600 shadow-xs'
            : 'text-stone-400 group-hover:text-stone-300'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </span>

      {/* Night Option Slot */}
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
          isDark
            ? 'bg-amber-500 text-[#1A0E08] shadow-xs'
            : 'text-stone-500 group-hover:text-stone-700'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </span>

      {/* Optional Tiny Label on hover or screen reader */}
      <span className="sr-only">Switch theme</span>
    </button>
  );
};
