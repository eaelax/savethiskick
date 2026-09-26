'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import KickDownloader from '@/components/KickDownloader';
import HowToSection from '@/components/HowToSection';
import ProgrammaticSeoSection from '@/components/ProgrammaticSeoSection';
import SeoKeywordsHub from '@/components/SeoKeywordsHub';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/AdminDashboard';
import LegalModal from '@/components/LegalModal';

export default function Home() {
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.search.includes('admin=true');
    }
    return false;
  });

  const [initialPresetUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('url') || '';
    }
    return '';
  });

  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'copyright' | null>(null);

  // Hidden admin access keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectToolPreset = (presetUrl: string) => {
    const input = document.getElementById('kick-url-input') as HTMLInputElement | null;
    if (input) {
      input.value = presetUrl;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const downloadBtn = document.getElementById('download-main-btn');
      downloadBtn?.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-[#53fc18] selection:text-[#000000] transition-colors duration-200">
      {/* Streamlined Header with Logo and Sun/Moon Dual Theme Switcher */}
      <Navbar />

      {/* Main Core Downloader Component */}
      <main className="flex-1">
        <KickDownloader initialUrl={initialPresetUrl} />

        {/* 2 Ways to Download (Copy & Paste + Magic "savethis" Prefix) */}
        <HowToSection onTryPreset={handleSelectToolPreset} />

        {/* Compact, Slim VOD & Clip Features Grid */}
        <ProgrammaticSeoSection onSelectTool={handleSelectToolPreset} />

        {/* Technical Specifications & pSEO Keyword Hub */}
        <SeoKeywordsHub />

        {/* Redesigned Modern FAQ Section */}
        <FaqSection />
      </main>

      {/* Clean Footer with Privacy & Legal Links */}
      <Footer onOpenLegal={(tab) => setLegalModalTab(tab)} />

      {/* Hidden Admin Dashboard (Internal only, Ctrl+Shift+A) */}
      {isAdminOpen && (
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Legal & Privacy Compliance Modal */}
      <LegalModal
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
}
