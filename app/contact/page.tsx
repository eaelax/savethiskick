import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us – SaveThisKick Support & Inquiries',
  description:
    'Get in touch with the SaveThisKick development and legal team for support, feature feedback, partnership requests, or DMCA inquiries.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
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
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight text-slate-900 dark:text-white">
            Contact Support & Inquiries
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Have a question about downloading, encountered a bug with a specific Kick VOD, or need to reach our copyright team? Reach out through any of the channels below.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#53FC18] block mb-1">
              General
            </span>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Support</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              For bug reports, browser troubleshooting, or general questions:
            </p>
            <div className="pt-2">
              <a
                href="mailto:support@savethiskick.com"
                className="text-xs font-mono font-bold text-slate-900 dark:text-[#53FC18] hover:underline"
              >
                support@savethiskick.com
              </a>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#53FC18] block mb-1">
              Legal
            </span>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Copyright & DMCA</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              For rights holders, content creators, and copyright agents:
            </p>
            <div className="pt-2">
              <a
                href="mailto:dmca@savethiskick.com"
                className="text-xs font-mono font-bold text-slate-900 dark:text-[#53FC18] hover:underline"
              >
                dmca@savethiskick.com
              </a>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#53FC18] block mb-1">
              Desk
            </span>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Response Time</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Our engineering and compliance desk monitors inquiries 7 days a week. Typical response time is within 24 to 48 business hours.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send a Message</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 font-normal">
            Fill out the form below and our team will get back to you promptly.
          </p>

          <ContactForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}
