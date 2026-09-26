import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DMCA & Copyright Policy – SaveThisKick',
  description:
    'SaveThisKick DMCA and Copyright Compliance Policy. We respect digital creators and intellectual property rights. Review our takedown notification guidelines.',
  alternates: {
    canonical: '/dmca',
  },
};

export default function DmcaPage() {
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
            Intellectual Property
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight text-slate-900 dark:text-white">
            DMCA & Copyright Disclaimer
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-normal">
            Compliance with the Digital Millennium Copyright Act (17 U.S.C. § 512)
          </p>
        </header>

        <article className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. General Statement of Principle</h2>
            <p className="font-normal">
              SaveThisKick operates as an automated software utility and protocol transcoder. We do not host, store, cache, upload, or archive media files on our infrastructure. All video streams, audio fragments, and thumbnails are retrieved on-the-fly directly from public content delivery networks (CDNs) and saved directly to the user&apos;s local device memory or hard drive.
            </p>
            <p className="font-normal">
              SaveThisKick respect the rights of intellectual property holders and expects its users to do the same in accordance with applicable laws.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Non-Affiliation Notice</h2>
            <p className="font-normal">
              SaveThisKick is not associated, affiliated, endorsed, or certified by Kick.com or Kick Gaming LLC. All registered trademarks, stream titles, broadcaster avatars, and clip metadata remain the exclusive property of their respective owners.
            </p>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Notice and Takedown Procedure (DMCA Notice)
            </h2>
            <p className="font-normal">
              If you are a copyright owner, or authorized to act on behalf of one, and you believe that any material accessed through our utility infringes upon your copyright, you may submit a formal notification with the following details:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-normal">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
              <li>Identification of the copyrighted work claimed to have been infringed, or if multiple works are covered, a representative list.</li>
              <li>Identification of the specific URL, streamer username, or video ID on Kick that is the subject of the claim.</li>
              <li>Sufficient information to permit us to contact you, including your name, physical address, telephone number, and email address.</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner.</li>
            </ul>
          </section>

          <section className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Designated DMCA Agent Contact
            </h2>
            <p className="font-normal">
              Please send all formal DMCA notices or copyright inquiries to our designated legal contact:
            </p>
            <div className="p-4 rounded-xl bg-white dark:bg-[#121619] border border-slate-200 dark:border-zinc-700 font-mono text-xs sm:text-sm text-slate-800 dark:text-white space-y-1">
              <p><strong>Entity:</strong> SaveThisKick Legal & Copyright Team</p>
              <p><strong>Email:</strong> dmca@savethiskick.com</p>
              <p><strong>Response Time:</strong> Typically within 24 to 48 business hours</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              You may also reach our team directly using our{' '}
              <Link href="/contact" className="text-slate-900 dark:text-[#53FC18] hover:underline font-semibold">
                Contact Us form
              </Link>.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
