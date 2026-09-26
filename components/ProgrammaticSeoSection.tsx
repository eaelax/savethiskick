'use client';

import React from 'react';

interface ProgrammaticSeoSectionProps {
  onSelectTool?: (presetUrl: string) => void;
}

export default function ProgrammaticSeoSection({ onSelectTool }: ProgrammaticSeoSectionProps) {
  const tools = [
    {
      id: 'vod-downloader',
      tag: '.MP4/.MPG',
      title: 'FULL VIDEO',
      subtitle: 'Original Bitrate',
      desc: 'Save full past broadcasts directly from source CDNs in .mp4/.mpg format for native desktop playback.',
      preset: 'https://kick.com/achrafsabiri/videos/01a0c52a-dde0-70e3-8784-9685d39d3bf0',
    },
    {
      id: 'audio-mp3-extractor',
      tag: '.MP3',
      title: 'ONLY AUDIO',
      subtitle: '320kbps High-Fi',
      desc: 'Extract crystal-clear talk, Just Chatting, and podcast audio tracks for offline listening.',
      preset: 'https://kick.com/achrafsabiri/videos/01a0c52a-dde0-70e3-8784-9685d39d3bf0',
    },
    {
      id: 'clip-downloader',
      tag: 'CLIPS',
      title: 'Viral Clip Downloader',
      subtitle: 'Zero Watermark',
      desc: 'Download viral streamer moments and highlights in clean format ready for YouTube Shorts & TikTok.',
      preset: 'https://kick.com/adinross?clip=clip_01h9y27vqw82nm99',
    },
  ];

  return (
    <section id="features" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[var(--border-color)]">
      {/* Clean Header */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
          Features of our Kick Stream Downloader
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Engineered for high bitrate extraction with zero server queue delays.
        </p>
      </div>

      {/* Clean, Static 3-Column Strip (No Hover Animations) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool && onSelectTool(tool.preset)}
            className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-[#F1F5F9] dark:bg-[#181D20] shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="px-2 py-0.5 rounded bg-[#53FC18] text-[#000000] font-mono font-bold text-[10px]">
                  {tool.tag}
                </span>
                <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {tool.subtitle}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {tool.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed font-normal">
                {tool.desc}
              </p>
            </div>

            <div className="mt-3.5 pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-normal text-slate-500 dark:text-slate-400">
              <span>Load preset</span>
              <span className="text-xs font-medium text-slate-800 dark:text-white">Select →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
