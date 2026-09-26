import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service – SaveThisKick | Conditions of Use',
  description:
    'SaveThisKick Terms of Service. Understand your rights and responsibilities when using our free Kick video and audio downloader utility for personal backup.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
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
            Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-normal">
            Effective Date: September 2026 • Version 2.4
          </p>
        </header>

        <article className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p className="font-normal">
              By accessing or using SaveThisKick (&quot;the Service&quot;), available at this website and via address bar prefix shortcuts, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Permitted Use & Personal Archival
            </h2>
            <p className="font-normal">
              SaveThisKick is a technical utility designed strictly for personal, non-commercial media backup, video editing, highlight reel compilation, and educational offline viewing. Users agree that:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-normal">
              <li>You will only process and download broadcasts or clips that you have the right to access, or for which the creator has made the stream publicly accessible.</li>
              <li>You will not use the Service to mass-republish, sell, monetize, or redistribute copyrighted content without the express written permission of the respective copyright holder.</li>
              <li>You are solely responsible for ensuring your use complies with applicable local copyright laws and fair use doctrines in your jurisdiction.</li>
            </ul>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Non-Affiliation Disclaimer
            </h2>
            <p className="font-normal">
              SaveThisKick is an independent web application and is not affiliated with, authorized by, sponsored by, or in any way officially connected with Kick Gaming LLC, Kick.com, or any of their affiliates or subsidiaries. The official Kick website is accessible at kick.com.
            </p>
            <p className="font-normal">
              The names &quot;Kick&quot;, &quot;Kick.com&quot;, as well as related names, marks, emblems, and logos, are registered trademarks of their respective owners.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Disclaimer of Warranties</h2>
            <p className="font-normal">
              The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. We do not warrant that the Service will operate uninterrupted or error-free, that defects will be corrected immediately, or that the utility will remain functional if third-party streaming protocols or API endpoints are modified.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
            <p className="font-normal">
              To the fullest extent permitted by applicable law, SaveThisKick, its developers, and operators shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from your access to, use of, or inability to use this Service.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Intellectual Property & DMCA</h2>
            <p className="font-normal">
              We respect the intellectual property rights of creators and copyright owners. If you believe that your copyrighted work is being infringed through our platform, please consult our{' '}
              <Link href="/dmca" className="text-slate-900 dark:text-[#53FC18] hover:underline font-semibold">
                DMCA & Copyright Policy
              </Link>{' '}
              for immediate takedown and contact procedures.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Modifications to Terms</h2>
            <p className="font-normal">
              We reserve the right to revise these Terms of Service at any time. Any changes will be posted on this page with an updated &quot;Effective Date&quot;. Continued use of the Service after any modification constitutes your acceptance of the updated terms.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
