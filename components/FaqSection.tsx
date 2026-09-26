'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';

export default function FaqSection() {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[var(--border-color)]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t.faq.sectionTitle}
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {t.faq.sectionSubtitle}
        </p>
      </div>

      {/* Clean Minimalist Accordion List with Subtle Divider Lines (Static, No Hover Effects) */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
        {t.faq.items.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx}>
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer select-none"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-snug">
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="pb-5 pt-0 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
