'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SeoKeywordsHub() {
  const [activeTab, setActiveTab] = useState<'specs' | 'reasons' | 'keywords'>('specs');

  const qualitySpecs = [
    { quality: '1080p60 HD (Source)', resolution: '1920 x 1080', fps: '60 FPS', bitrate: '8,000 - 10,000 kbps', audio: '320 kbps AAC', format: '.MP4/.MPG' },
    { quality: '720p60 (High Quality)', resolution: '1280 x 720', fps: '60 FPS', bitrate: '4,500 kbps', audio: '192 kbps AAC', format: '.MP4/.MPG' },
    { quality: '480p (Standard)', resolution: '854 x 480', fps: '30 FPS', bitrate: '2,000 kbps', audio: '128 kbps AAC', format: '.MP4/.MPG' },
    { quality: '360p (Mobile Saver)', resolution: '640 x 360', fps: '30 FPS', bitrate: '1,000 kbps', audio: '96 kbps AAC', format: '.MP4/.MPG' },
    { quality: 'MP3 Audio Only', resolution: 'N/A (Audio)', fps: 'N/A', bitrate: '320 kbps High-Fi', audio: 'Stereo 48kHz', format: '.MP3' },
  ];

  const popularKeywords = [
    { query: 'Kick VOD Downloader', intent: 'Save complete past live broadcasts in full HD 1080p60', href: '/tools/kick-vod-downloader' },
    { query: 'Download Kick Clips', intent: 'Instant clean video downloads without annoying watermarks', href: '/tools/kick-clips-downloader' },
    { query: 'SaveThisKick Shortcut', intent: 'Add savethis before kick.com in the URL to download instantly', href: '/tools/download-kick-stream-without-buffering' },
    { query: 'Kick to MP3 Audio', intent: 'Rip 320kbps MP3 tracks from Just Chatting and podcasts', href: '/tools/kick-audio-mp3-extractor' },
    { query: 'xQc Kick VODs', intent: 'Download full xQc broadcasts and marathon gaming replays', href: '/download/xqc-vod' },
    { query: 'Adin Ross Kick VODs', intent: 'Download Adin Ross celebrity interviews and IRL streams', href: '/download/adinross-vod' },
    { query: 'Westcol Kick VODs', intent: 'Download Westcol streams, music events, and Spanish broadcasts', href: '/download/westcol-vod' },
    { query: 'Trainwreckstv VODs', intent: 'Download Scuffed Podcast and late-night gaming sessions', href: '/download/trainwreckstv-vod' },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[var(--border-color)]">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Kick Video & Audio Download Specifications
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed">
          SaveThisKick bypasses client-side transcoding to deliver authentic stream bitrates directly from Kick streaming clusters.
        </p>

        {/* Tab switchers */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-[#53FC18] text-[#000000] shadow-xs'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            Resolution Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reasons')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'reasons'
                ? 'bg-[#53FC18] text-[#000000] shadow-xs'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            Why Archive Kick VODs?
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('keywords')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'keywords'
                ? 'bg-[#53FC18] text-[#000000] shadow-xs'
                : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
            }`}
          >
            Search Keyword Index
          </button>
        </div>
      </div>

      {activeTab === 'specs' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-[#F1F5F9] dark:bg-[#181D20] shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-200/70 dark:bg-zinc-800/70 text-sm font-semibold tracking-wider text-slate-700 dark:text-slate-300">
                <th className="py-3.5 px-4">Quality Profile</th>
                <th className="py-3.5 px-4">Resolution</th>
                <th className="py-3.5 px-4">Frame Rate</th>
                <th className="py-3.5 px-4">Video Bitrate</th>
                <th className="py-3.5 px-4">Audio Quality</th>
                <th className="py-3.5 px-4">File Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 bg-white dark:bg-[#181D20]/50">
              {qualitySpecs.map((spec, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                    {spec.quality}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-normal text-slate-600 dark:text-slate-300">{spec.resolution}</td>
                  <td className="py-3.5 px-4 font-mono font-normal text-slate-600 dark:text-slate-300">{spec.fps}</td>
                  <td className="py-3.5 px-4 font-mono font-normal text-slate-600 dark:text-slate-300">{spec.bitrate}</td>
                  <td className="py-3.5 px-4 font-mono font-normal text-slate-600 dark:text-slate-300">{spec.audio}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded bg-[#53FC18] font-mono text-xs font-bold text-[#000000] shadow-2xs">
                      {spec.format}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reasons' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-[#F1F5F9] dark:bg-[#181D20] shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-[#53FC18] uppercase tracking-wider block mb-2">
              AUTO-PURGE
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              30-60 Day Auto-Deletion
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Kick server policies automatically purge past broadcast VODs after 30 or 60 days. SaveThisKick gives you permanent local ownership.
            </p>
          </div>

          <div
            className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-[#F1F5F9] dark:bg-[#181D20] shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-[#53FC18] uppercase tracking-wider block mb-2">
              TAKEDOWN RISK
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              DMCA & Deleted Streams
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Streamers often unpublish broadcasts due to copyright music or private moments. Downloading while live or right after ensures you never lose content.
            </p>
          </div>

          <div
            className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-[#F1F5F9] dark:bg-[#181D20] shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-[#53FC18] uppercase tracking-wider block mb-2">
              CREATORS
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Clean Video Editing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Content creators downloading clips for YouTube Shorts and TikTok receive pristine .MPG / .MP3 files with synchronized audio and zero watermarks.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'keywords' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {popularKeywords.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-[#F1F5F9] dark:bg-[#181D20] shadow-sm hover:shadow-md hover:border-[#53FC18]/50 transition-all text-xs block group"
            >
              <div className="font-bold text-sm mb-1 text-slate-900 dark:text-white group-hover:text-[#53FC18] transition-colors flex items-center justify-between">
                <span>{item.query}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-[#53FC18] transition-colors">↗</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {item.intent}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
