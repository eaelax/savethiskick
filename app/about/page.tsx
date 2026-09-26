import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us – SaveThisKick | High-Speed Kick Video & Audio Downloader',
  description:
    'Learn about SaveThisKick, our mission, high-speed streaming architecture, zero-RAM browser technology, and commitment to user privacy.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
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
            About SaveThisKick
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight text-slate-900 dark:text-white">
            The Fastest, Zero-Disk Downloader for Kick Streamers and Fans
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            SaveThisKick was engineered by digital media architects to provide a fast, private, and frictionless utility for archiving past broadcasts, creating viral highlight clips, and extracting crystal-clear audio from Kick.com.
          </p>
        </header>

        <section className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Our Mission
            </h2>
            <p className="font-normal">
              Kick is one of the fastest-growing live streaming communities in the world. However, content creators, video editors, and fans often struggle to save long broadcasts for editing, YouTube highlight reels, or offline archival without experiencing failed downloads, third-party bloatware, or annoying watermarks.
            </p>
            <p className="font-normal">
              SaveThisKick solves this by offering an instant, ad-friendly, and browser-native downloading solution that requires no desktop software installation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#53FC18] block mb-1">
                Video Format
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Direct Desktop Container (.MPG)</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Downloaded videos are formatted into standard MPEG desktop containers, making them instantly playable on Windows Media Player, macOS QuickTime, VLC, and video editing suites without codec transcoding issues.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#53FC18] block mb-1">
                Architecture
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Client-Side Streaming Engine</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Using modern File System Access APIs and stream pipe technology, video segments are written chunk-by-chunk straight to your hard drive, preventing browser memory exhaustion even on 8-hour VODs.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#53FC18] block mb-1">
                Zero Logs
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Strict Privacy & No Logs</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                We believe in total privacy. We do not require registration, we do not store user download history, and all streams are processed anonymously in accordance with global privacy principles.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#53FC18] block mb-1">
                Quick Shortcut
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Address Bar Shortcut</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Our hallmark innovation: you can simply prefix any Kick stream URL with <strong className="font-bold text-slate-900 dark:text-[#53FC18]">savethis</strong> (e.g., savethiskick.com/streamer) to load and download within seconds.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Disclaimer of Affiliation</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              SaveThisKick is an independent software tool developed for personal backup and educational purposes. SaveThisKick is not endorsed by, sponsored by, or affiliated with Kick.com or its parent entities. All trademarks, channel names, and streamer branding remain the exclusive intellectual property of their respective copyright owners.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
