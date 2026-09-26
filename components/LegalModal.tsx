'use client';

import React, { useState } from 'react';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms' | 'copyright';
  onClose: () => void;
}

export default function LegalModal({
  isOpen,
  initialTab = 'privacy',
  onClose,
}: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'copyright'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#000000]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-main)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {activeTab === 'privacy' && 'Privacy Policy'}
            {activeTab === 'terms' && 'Terms of Service'}
            {activeTab === 'copyright' && 'Copyright & DMCA Disclaimer'}
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer text-xl font-bold flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--border-color)] px-6 bg-[var(--bg-subtle)] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#53FC18] text-[#53FC18]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#53FC18] text-[#53FC18]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('copyright')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'copyright'
                ? 'border-[#53FC18] text-[#53FC18]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Copyright & DMCA
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[var(--text-primary)] text-base">1. Zero Log Guarantee</h3>
              <p>
                SaveThisKick is designed with a strict zero-knowledge architecture. We do not store, catalog, log, or track your IP address, browser footprint, or the specific URLs and streams you analyze or download.
              </p>

              <h3 className="font-bold text-[var(--text-primary)] text-base">2. In-Memory Processing</h3>
              <p>
                Video streams and manifest resolutions are handled entirely in ephemeral transit or processed directly within your client browser. We never persist downloaded video files on permanent disks.
              </p>

              <h3 className="font-bold text-[var(--text-primary)] text-base">3. Cookies & Advertising</h3>
              <p>
                We do not use tracking cookies. When advertising partners (such as Google AdSense) are deployed in the future, standard anonymized advertising cookies may be utilized in accordance with Google privacy policies.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[var(--text-primary)] text-base">1. Acceptable Use</h3>
              <p>
                SaveThisKick provides an online utility to assist users in saving freely available public streams for personal, non-commercial offline viewing and educational archiving.
              </p>

              <h3 className="font-bold text-[var(--text-primary)] text-base">2. No Affiliation</h3>
              <p>
                SaveThisKick is an independent tool and is in no way affiliated, authorized, maintained, sponsored, or endorsed by Kick.com or its parent company Stake / Easygo Entertainment Pty Ltd.
              </p>

              <h3 className="font-bold text-[var(--text-primary)] text-base">3. User Responsibility</h3>
              <p>
                Users assume full legal responsibility for ensuring they have the necessary rights and permissions to download or archive any broadcast content.
              </p>
            </div>
          )}

          {activeTab === 'copyright' && (
            <div className="space-y-3">
              <h3 className="font-bold text-[var(--text-primary)] text-base">1. DMCA Compliance</h3>
              <p>
                SaveThisKick respects the intellectual property rights of all content creators and streamers. SaveThisKick does not host or store any video files on its servers; our tool resolves publicly accessible HLS media streams directly from official content delivery networks.
              </p>

              <h3 className="font-bold text-[var(--text-primary)] text-base">2. Content Ownership</h3>
              <p>
                All trademarks, logos, stream clips, and video materials remain the sole property of their respective owners and copyright holders.
              </p>

              <h3 className="font-bold text-[var(--text-primary)] text-base">3. Takedown Requests</h3>
              <p>
                If you are a copyright holder or an authorized representative and wish to request domain-level blocking or filtering of specific channels or content, contact our designated agent at dmca@savethiskick.com.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#53FC18] text-black font-bold text-xs sm:text-sm rounded-lg hover:brightness-110 transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
