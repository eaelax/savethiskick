'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme, setTheme, mounted } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selector"
      className="relative inline-flex items-center p-1 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-full select-none cursor-pointer transition-colors duration-200 shadow-xs"
      onClick={(e) => {
        // If clicking on background area, toggle theme
        if (e.target === e.currentTarget) {
          toggleTheme();
        }
      }}
    >
      {/* Smooth hardware-accelerated sliding active pill */}
      <div
        className={`absolute top-1 left-1 w-8 h-7 rounded-full transition-transform duration-200 ease-out pointer-events-none ${
          theme === 'dark'
            ? 'translate-x-8 bg-[#181D20] border border-[#262C30] shadow-xs text-[#53FC18]'
            : 'translate-x-0 bg-white border border-slate-200 shadow-xs text-amber-500'
        }`}
      />

      {/* Light (Sun) Button */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        aria-label="Light mode"
        onClick={(e) => {
          e.stopPropagation();
          setTheme('light');
        }}
        title="Switch to Light Mode"
        className={`relative z-10 w-8 h-7 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer ${
          theme === 'light'
            ? 'text-amber-500 font-bold'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
        }`}
      >
        <Sun className="w-3.5 h-3.5" strokeWidth={2.2} />
      </button>

      {/* Dark (Moon) Button */}
      <button
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        aria-label="Dark mode"
        onClick={(e) => {
          e.stopPropagation();
          setTheme('dark');
        }}
        title="Switch to Dark Mode"
        className={`relative z-10 w-8 h-7 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer ${
          theme === 'dark'
            ? 'text-[#53FC18] font-bold'
            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
        }`}
      >
        <Moon className="w-3.5 h-3.5" strokeWidth={2.2} />
      </button>
    </div>
  );
}
