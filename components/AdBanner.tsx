'use client';

import React, { useState } from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'leaderboard' | 'rectangle' | 'horizontal';
  className?: string;
}

export default function AdBanner({
  slotId = '0000000000',
  format = 'leaderboard',
  className = '',
}: AdBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  // Format dimensions
  const heightClasses =
    format === 'leaderboard'
      ? 'h-[90px] max-w-[728px]'
      : format === 'rectangle'
      ? 'h-[250px] max-w-[300px]'
      : 'h-[60px] max-w-full';

  return (
    <div
      className={`mx-auto w-full flex flex-col items-center justify-center my-6 select-none ${className}`}
    >
      <div className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)] mb-1">
        Advertisement
      </div>

      <div
        className={`w-full ${heightClasses} border border-dashed border-[var(--border-color)] bg-[var(--bg-subtle)]/60 rounded-md flex flex-col items-center justify-center p-3 text-center transition-colors relative overflow-hidden`}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#53fc18]" />
          <span>Google AdSense Ready Slot</span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            ({format === 'leaderboard' ? '728×90 Leaderboard' : '300×250 Medium Rectangle'})
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-md hidden sm:block">
          Slot ID: pub-ca-{slotId} • High-performing placement optimized for SEO and viewability.
        </p>

        {/* Real AdSense tag hook */}
        <ins
          className="adsbygoogle"
          style={{ display: 'none' }}
          data-ad-client="ca-pub-0000000000000000"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
