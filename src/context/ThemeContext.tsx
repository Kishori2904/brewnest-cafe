import React, { createContext, useContext, useState, useEffect } from 'react';

export type CafeTheme = 'day' | 'night';

export interface ThemeContextType {
  theme: CafeTheme;
  themeName: string;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: CafeTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'brewnest_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<CafeTheme>(() => {
    if (typeof window === 'undefined') return 'day';
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored === 'night' || stored === 'evening-lounge') {
        return 'night';
      }
      if (stored === 'day' || stored === 'cafe-day') {
        return 'day';
      }
      // If user has system dark preference, we can still default to day or check preference
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
      return prefersDark ? 'night' : 'day';
    } catch {
      return 'day';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }

    const root = document.documentElement;
    if (theme === 'night') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'evening-lounge');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'cafe-day');
    }

    // Update meta theme-color for browser tab / mobile chrome
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'night' ? '#120A06' : '#FAF7F2');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  const setTheme = (newTheme: CafeTheme) => {
    setThemeState(newTheme);
  };

  const themeName = theme === 'night' ? 'Evening Lounge' : 'Café Day';
  const isDark = theme === 'night';

  return (
    <ThemeContext.Provider value={{ theme, themeName, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
