'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, LanguageCode } from '@/lib/i18n';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const codes: LanguageCode[] = ['en', 'fr', 'ar', 'de', 'ch'];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative inline-flex items-center gap-1.5 h-9 px-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] hover:border-slate-300 dark:hover:border-zinc-700 rounded-full select-none cursor-pointer transition-colors duration-200 shadow-xs text-xs font-bold text-[var(--text-primary)]"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#1D9BF0] dark:text-[#38BDF8] shrink-0" strokeWidth={2.2} />
        <span className="font-mono tracking-wider text-xs font-bold text-slate-800 dark:text-slate-200">
          {language.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={2.2}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 p-1 rounded-2xl bg-white dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-lg z-50 backdrop-blur-md">
          <div className="flex flex-col gap-0.5">
            {codes.map((code) => {
              const isSelected = code === language;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setLanguage(code);
                    setIsOpen(false);
                  }}
                  className={`w-full py-1.5 px-2 rounded-xl text-center text-xs font-mono font-bold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#53FC18] text-[#000000] shadow-2xs font-extrabold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
