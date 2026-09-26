'use client';

import React from 'react';
import Link from 'next/link';
import KickLogo from './KickLogo';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/lib/i18n';

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-canvas)]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer" aria-label="SaveThisKick Home">
          <KickLogo size={32} showText={true} />
        </Link>

        {/* Center / Right Navigation Links, Language Selector & Theme Toggle */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[var(--text-secondary)]">
            <Link href="/#how-to" className="hover:text-[var(--brand-text)] transition-colors">
              {t.nav.howTo}
            </Link>
            <Link href="/about" className="hover:text-[var(--brand-text)] transition-colors">
              {t.nav.about}
            </Link>
            <Link href="/contact" className="hover:text-[var(--brand-text)] transition-colors">
              {t.nav.contact}
            </Link>
            <Link href="/#faq" className="hover:text-[var(--brand-text)] transition-colors">
              {t.nav.faq}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
