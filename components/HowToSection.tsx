'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';

interface HowToSectionProps {
  onTryPreset?: (url: string) => void;
}

export default function HowToSection({ onTryPreset }: HowToSectionProps = {}) {
  const { t } = useLanguage();

  const steps = [
    { ...t.steps.step1, color: '#97fd74' },
    { ...t.steps.step2, color: '#75fc46' },
    { ...t.steps.step3, color: '#53fc18' },
  ];

  return (
    <section id="how-to" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[var(--border-color)]">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t.steps.sectionTitle}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
          {t.steps.sectionSubtitle}
        </p>
      </div>

      {/* Modern Connected Process Flow & Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step) => (
          <div
            key={step.num}
            className="relative bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            {/* Step Content: Number integrated directly at start of title */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5 leading-snug flex items-baseline gap-2">
                <span
                  className="font-mono font-bold text-lg sm:text-xl shrink-0"
                  style={{ color: step.color }}
                >
                  {step.num}.
                </span>
                <span>{step.title}</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-zinc-800/80 text-xs text-slate-500 dark:text-slate-400 font-normal flex items-start gap-1.5">
              <span className="shrink-0">💡</span>
              <span>{step.tip}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
