import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy – SaveThisKick | GDPR & CCPA Compliant',
  description:
    'SaveThisKick Privacy Policy. Learn how we handle data with zero logging, anonymous client-side processing, and strict compliance with GDPR and CCPA standards.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-[#0B0E0F] text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <Link
          href="/"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-[#53FC18] mb-8 cursor-pointer transition-colors"
        >
          <span>← Back to Downloader</span>
        </Link>

        <header className="mb-10">
          <span className="px-2.5 py-1 rounded-md bg-[#53FC18]/15 text-slate-900 dark:text-[#53FC18] font-mono text-xs font-bold uppercase tracking-wider">
            Privacy & Data Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-normal">
            Last Updated: September 2026 • Effective Date: September 2026
          </p>
        </header>

        <article className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Commitment to User Privacy</h2>
            <p className="font-normal">
              SaveThisKick (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to safeguarding the privacy of users who visit and use our web application. We operate under a strict <strong>Zero-Logging Architecture</strong>: we do not maintain accounts, require registration, collect personal identities, or store personal files on our servers.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Information We Do Not Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-normal">
              <li><strong>No Personal Identifiers:</strong> We do not ask for or collect names, email addresses, phone numbers, or social media logins.</li>
              <li><strong>No Media Archival:</strong> Downloaded video streams and audio tracks are streamed directly to your client browser and local disk. We do not retain copies of your requested videos.</li>
              <li><strong>No User Search Histories:</strong> We do not log IP addresses alongside specific streamer search queries.</li>
            </ul>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Technical & Operational Logs</h2>
            <p className="font-normal">
              Like virtually all web services, our web hosting provider and Cloudflare edge network may process transient technical logs (such as request timestamps, HTTP user agent, error codes, and coarse geolocation country) strictly for the purpose of DDoS mitigation, performance caching, and server health diagnostics. These ephemeral logs are automatically purged on a regular cycle.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Cookies and Google AdSense</h2>
            <p className="font-normal">
              SaveThisKick uses cookies to remember user interface preferences (such as Dark/Light theme). In addition, third-party advertising partners, including <strong>Google AdSense</strong>, may use cookies, web beacons, and related technologies to serve ads based on prior visits to our website or other websites on the internet.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet. You may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 dark:text-[#53FC18] underline font-medium hover:text-[#53FC18]"
              >
                Google Ads Settings
              </a>{' '}
              or{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 dark:text-[#53FC18] underline font-medium hover:text-[#53FC18]"
              >
                aboutads.info
              </a>.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. GDPR & CCPA / CPRA Rights</h2>
            <p className="font-normal">
              Under the European General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), individuals have specific rights regarding personal data. Because SaveThisKick does not store, process, or sell personal identifiers or user databases, there is no personal profile retained to disclose, delete, or monetize.
            </p>
            <p className="font-normal">
              If you have any privacy questions or requests, you may contact our data controller directly at{' '}
              <a href="mailto:privacy@savethiskick.com" className="text-slate-900 dark:text-[#53FC18] font-mono font-bold underline">
                privacy@savethiskick.com
              </a>.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
