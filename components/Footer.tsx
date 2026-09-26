'use client';

import React from 'react';
import Link from 'next/link';
import KickLogo from './KickLogo';
import { useLanguage } from '@/lib/i18n';

interface FooterProps {
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'copyright') => void;
}

export default function Footer({ onOpenLegal }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--bg-canvas)] transition-colors mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--border-color)]">
          {/* Brand and Description */}
          <div className="space-y-2">
            <Link href="/" className="inline-block" aria-label="SaveThisKick Home">
              <KickLogo size={28} />
            </Link>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed font-normal">
              {t.footer.desc}
            </p>
          </div>

          {/* Navigation & Legal Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-[var(--text-secondary)]">
            <Link href="/about" className="hover:text-[var(--text-primary)] dark:hover:text-[#53FC18] transition-colors cursor-pointer font-medium">
              {t.footer.about}
            </Link>
            <Link href="/contact" className="hover:text-[var(--text-primary)] dark:hover:text-[#53FC18] transition-colors cursor-pointer font-medium">
              {t.footer.contact}
            </Link>
            <Link href="/privacy" className="hover:text-[var(--text-primary)] dark:hover:text-[#53FC18] transition-colors cursor-pointer font-medium">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-primary)] dark:hover:text-[#53FC18] transition-colors cursor-pointer font-medium">
              {t.footer.terms}
            </Link>
            <Link href="/dmca" className="hover:text-[var(--text-primary)] dark:hover:text-[#53FC18] transition-colors cursor-pointer font-medium">
              {t.footer.dmca}
            </Link>
            <Link href="/#how-to" className="hover:text-[var(--text-primary)] dark:hover:text-[#53FC18] transition-colors cursor-pointer font-medium">
              {t.footer.howTo}
            </Link>
            <Link href="/#faq" className="hover:text-[var(--text-primary)] dark:hover:text-[#53FC18] transition-colors cursor-pointer font-medium">
              {t.footer.faq}
            </Link>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-[var(--text-muted)] font-normal">
          <p>{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
