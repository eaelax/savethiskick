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
      <Navbar />

      <main className="flex-1">
        <React.Suspense fallback={<div className="w-full max-w-6xl mx-auto px-4 py-12" />}>
          <KickDownloader initialUrl={initialPresetUrl} />
        </React.Suspense>

        <HowToSection onTryPreset={handleSelectToolPreset} />
        <ProgrammaticSeoSection onSelectTool={handleSelectToolPreset} />
        <SeoKeywordsHub />
        <FaqSection />
      </main>

      <Footer onOpenLegal={(tab) => setLegalModalTab(tab)} />

      {isAdminOpen && (
        <AdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      <LegalModal
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
}
