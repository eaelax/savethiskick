'use client';

import { useSyncExternalStore, useCallback } from 'react';

export type Theme = 'dark' | 'light';

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem('kick_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Default theme is Light mode
    return 'light';
  } catch {
    return 'light';
  }
}

function getServerSnapshot(): Theme {
  return 'light';
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (typeof window === 'undefined') return () => listeners.delete(callback);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleMediaChange = () => {
    try {
      if (!localStorage.getItem('kick_theme')) {
        callback();
      }
    } catch {}
  };
  mediaQuery.addEventListener('change', handleMediaChange);

  return () => {
    listeners.delete(callback);
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}

function applyThemeClass(targetTheme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (targetTheme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem('kick_theme', newTheme);
    } catch {}
    applyThemeClass(newTheme);
    listeners.forEach((listener) => listener());
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, mounted: true };
}
