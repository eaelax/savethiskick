'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { KickMediaInfo } from '../app/api/kick/resolve/route';
import {
  createDirectFileWriter,
  downloadAndSaveMpegStreamToFile,
  downloadDirectStreamToFile,
  formatHumanEta,
} from '@/lib/hls-transmuxer';
import { sanitizeFilename } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { Video, Volume2, BadgeCheck } from 'lucide-react';

interface KickDownloaderProps {
  initialUrl?: string;
}

export default function KickDownloader({ initialUrl = '' }: KickDownloaderProps) {
  const { t } = useLanguage();
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mediaData, setMediaData] = useState<KickMediaInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quality and format selection (FULL VIDEO vs ONLY AUDIO)
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<'mpg' | 'mp3'>('mpg');

  // Real downloading progress state (0% to 100%)
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'completed' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadStats, setDownloadStats] = useState<{
    loadedBytes: number;
    totalBytes: number;
    speedMb: number;
    etaSeconds: number;
    etaHuman?: string;
    currentSegment?: number;
    totalSegments?: number;
    statusText?: string;
  }>({
    loadedBytes: 0,
    totalBytes: 0,
    speedMb: 0,
    etaSeconds: 0,
    etaHuman: '',
    currentSegment: 0,
    totalSegments: 0,
    statusText: '',
  });
  const [completedBlobUrl, setCompletedBlobUrl] = useState<string | null>(null);
  const [completedFilename, setCompletedFilename] = useState<string | null>(null);
  const [completedSize, setCompletedSize] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleDownloadAnalysis = useCallback(async (targetUrl?: string) => {
    const urlToTest = (targetUrl || urlInput).trim();
    if (!urlToTest) {
      setErrorMessage('Please enter a Kick VOD link.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setDownloadState('idle');
    setDownloadProgress(0);
    setCompletedBlobUrl(null);

    try {
      const res = await fetch('/api/kick/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to resolve Kick stream metadata.');
      }

      setMediaData(data.media);
      if (data.media?.qualities?.length > 0) {
        setSelectedQuality(data.media.qualities[0].label);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while analyzing the link.';
      setErrorMessage(msg);
      setMediaData(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [urlInput]);

  const analyzedInitialRef = useRef(false);
  useEffect(() => {
    if (initialUrl && initialUrl.trim().length > 0 && !analyzedInitialRef.current) {
      analyzedInitialRef.current = true;
      const cleanInit = initialUrl.trim();
      setUrlInput(cleanInit);
      handleDownloadAnalysis(cleanInit);
    }
  }, [initialUrl, handleDownloadAnalysis]);

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text);
          setErrorMessage(null);
          if (text.includes('kick.com') || text.includes('savethis')) {
            handleDownloadAnalysis(text);
          }
        }
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleClear = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setUrlInput('');
    setMediaData(null);
    setErrorMessage(null);
    setDownloadState('idle');
    setDownloadProgress(0);
    setCompletedBlobUrl(null);
  };

  // In-Browser Transmuxing & Zero-RAM Direct Disk Streaming Download Engine
  const startFullDownload = async () => {
    if (!mediaData) return;

    const qualityObj = mediaData.qualities.find((q) => q.label === selectedQuality) || mediaData.qualities[0];
    const sourceUrl = selectedFormat === 'mp3'
      ? (mediaData.audioOnly?.streamUrl || qualityObj?.streamUrl)
      : (qualityObj?.streamUrl || mediaData.audioOnly?.streamUrl);

    const cleanTitle = mediaData.title ? mediaData.title.trim() : 'Kick_VOD';
    const streamerPrefix = mediaData.streamer.username ? `${mediaData.streamer.username} - ` : '';
    const rawTargetName = `${streamerPrefix}${cleanTitle}`;
    const targetFilename = sanitizeFilename(rawTargetName, selectedFormat === 'mp3' ? 'mp3' : 'mpg');

    const totalDurationSec = mediaData.durationSeconds || 3600;
    const baseEstimatedMb = selectedFormat === 'mp3' ? 85 : (qualityObj?.estimatedSizeMb || 1200);
    const expectedTotalBytes = Math.max(1024 * 1024, Math.round(baseEstimatedMb * 1024 * 1024));

    // Notify metrics API
    fetch('/api/admin/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'download_started',
        streamer: mediaData.streamer.username,
        format: selectedFormat,
        quality: selectedQuality,
      }),
    }).catch(() => {});

    // Abort previous download if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Initialize Direct File Writer (File System Access API or StreamSaver.js)
    let fileWriter;
    try {
      fileWriter = await createDirectFileWriter(targetFilename, expectedTotalBytes);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User deliberately canceled the save dialog
        return;
      }
      setDownloadError(err?.message || 'Failed to initialize disk stream writer');
      setDownloadState('error');
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setCompletedFilename(targetFilename);
    setDownloadError(null);
    setDownloadState('downloading');
    setDownloadProgress(0);
    setDownloadStats({
      loadedBytes: 0,
      totalBytes: expectedTotalBytes,
      speedMb: 0,
      etaSeconds: Math.round(totalDurationSec / 2),
      etaHuman: formatHumanEta(Math.round(totalDurationSec / 2)),
      currentSegment: 0,
      totalSegments: 0,
      statusText: selectedFormat === 'mp3' ? 'DOWNLOADING AUDIO' : 'DOWNLOADING VIDEO',
    });

    try {
      let finalBytes = 0;

      // Video download: Native MPEG stream piping with direct disk writing for 100% desktop compatibility (.mpg)
      if (selectedFormat === 'mpg' && (sourceUrl.includes('.m3u8') || mediaData.type === 'vod')) {
        const result = await downloadAndSaveMpegStreamToFile(
          {
            playlistUrl: sourceUrl,
            filename: targetFilename,
            preferredQuality: selectedQuality,
            estimatedTotalBytes: expectedTotalBytes,
            isAudio: false,
            signal: controller.signal,
            onProgress: (progress) => {
              setDownloadProgress(progress.progressPercent);
              setDownloadStats({
                loadedBytes: progress.loadedBytes,
                totalBytes: progress.totalEstimatedBytes || expectedTotalBytes,
                speedMb: progress.speedMb,
                etaSeconds: progress.etaSeconds,
                etaHuman: progress.etaHuman,
                currentSegment: progress.currentSegment,
                totalSegments: progress.totalSegments,
                statusText: 'DOWNLOADING VIDEO',
              });
            },
          },
          fileWriter
        );
        finalBytes = result.totalBytes;
      } else {
        // Direct stream or MP3 audio stream
        let streamUrl = sourceUrl;
        if (selectedFormat === 'mp3') {
          streamUrl = `/api/kick/download?url=${encodeURIComponent(sourceUrl)}&filename=${encodeURIComponent(targetFilename)}&format=mp3&type=${mediaData.type}`;
        } else {
          // Direct clip in .mpg container
          streamUrl = `/api/kick/download?url=${encodeURIComponent(sourceUrl)}&filename=${encodeURIComponent(targetFilename)}&format=mpg&type=${mediaData.type}`;
        }
        const result = await downloadDirectStreamToFile(
          streamUrl,
          fileWriter,
          expectedTotalBytes,
          controller.signal,
          (progress) => {
            setDownloadProgress(progress.progressPercent);
            setDownloadStats({
              loadedBytes: progress.loadedBytes,
              totalBytes: progress.totalEstimatedBytes || expectedTotalBytes,
              speedMb: progress.speedMb,
              etaSeconds: progress.etaSeconds,
              etaHuman: progress.etaHuman,
              currentSegment: progress.currentSegment,
              totalSegments: progress.totalSegments,
              statusText: selectedFormat === 'mp3' ? 'DOWNLOADING AUDIO' : 'DOWNLOADING VIDEO',
            });
          },
          selectedFormat === 'mp3'
        );
        finalBytes = result.totalBytes;
      }

      // Format final size
      const finalSizeFormatted = finalBytes >= 1024 * 1024 * 1024
        ? `${(finalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
        : `${(finalBytes / (1024 * 1024)).toFixed(1)} MB`;

      setCompletedSize(finalSizeFormatted);
      if (fileWriter.getBlobUrl) {
        setCompletedBlobUrl(fileWriter.getBlobUrl());
      }
      setDownloadProgress(100);
      setDownloadState('completed');

      // Track completion
      fetch('/api/admin/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'download_completed',
          streamer: mediaData.streamer.username,
          format: selectedFormat,
          quality: selectedQuality,
          bytes: finalBytes,
        }),
      }).catch(() => {});
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message === 'Download canceled.') {
        setDownloadState('idle');
        setDownloadProgress(0);
        return;
      }
      console.error('Download error:', err);
      setDownloadError(err.message || 'Download pipeline encountered an error.');
      setDownloadState('error');

      // Track failure
      fetch('/api/admin/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'download_error',
          streamer: mediaData.streamer.username,
          format: selectedFormat,
          error: err?.message,
        }),
      }).catch(() => {});
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setDownloadState('idle');
    setDownloadProgress(0);
    setDownloadStats({
      loadedBytes: 0,
      totalBytes: 0,
      speedMb: 0,
      etaSeconds: 0,
      currentSegment: 0,
      totalSegments: 0,
      statusText: '',
    });
  };

  const formatSizeDisplay = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  };

  // Helper to remove (SOURCE HD), (Source), and HD from quality labels
  const formatQualityLabel = (label: string) => {
    if (/1080p/i.test(label)) {
      return '1080p60';
    }
    return label
      .replace(/\s*\(?SOURCE\s*(HD)?\)?/gi, '')
      .replace(/\s*\(?Source\)?/gi, '')
      .replace(/\s*HD/gi, '')
      .trim();
  };

  const selectedQualityObj = mediaData?.qualities.find((q) => q.label === selectedQuality) || mediaData?.qualities[0];
  const fullMb = selectedQualityObj?.estimatedSizeMb || 1200;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Title */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.hero.title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          {t.hero.subtitle}
        </p>
      </div>

      {/* Main URL Input Bar */}
      <div
        className="w-full max-w-3xl mx-auto bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 rounded-xl p-2 sm:p-2.5 transition-all duration-200 focus-within:border-slate-300 dark:focus-within:border-zinc-700 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              id="kick-url-input"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDownloadAnalysis()}
              placeholder={t.input.placeholder}
              className="w-full h-12 sm:h-14 ps-4 pe-24 rounded-lg bg-white dark:bg-[#121619] text-sm sm:text-base text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors border border-slate-200 dark:border-zinc-700/60 font-normal"
            />

            <div className="absolute end-2 flex items-center">
              {urlInput.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear input"
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 hover:dark:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer uppercase tracking-wider shadow-2xs"
                >
                  {t.input.clear}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  title="Paste from clipboard"
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 hover:dark:bg-slate-600 border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer uppercase tracking-wider shadow-2xs"
                >
                  {t.input.paste}
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            id="download-main-btn"
            onClick={() => handleDownloadAnalysis()}
            disabled={isAnalyzing}
            className="h-12 sm:h-14 px-7 sm:px-9 rounded-lg bg-[#53FC18] text-[#000000] font-bold text-sm sm:text-base hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-75 uppercase tracking-wider shrink-0"
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" />
                <span>{t.input.analyzing}</span>
              </>
            ) : (
              <span>{t.input.download}</span>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-2.5 p-3.5 bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-lg flex items-center justify-between gap-3 animate-fadeIn font-normal">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold underline hover:brightness-125 shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* VOD Details Container */}
      {mediaData && (
        <div
          id="vod-details-container"
          className="mt-6 w-full max-w-4xl mx-auto bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 md:p-7 transition-all animate-fadeIn shadow-sm min-w-0 overflow-hidden"
        >
          {mediaData.isLatestFromChannel && (
            <div className="mb-4 sm:mb-5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-normal text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#53FC18] animate-pulse shrink-0" />
              <span className="truncate">
                {t.details.autoResolvedBadge}{' '}
                <strong className="text-slate-900 dark:text-white font-semibold">@{mediaData.streamer.username}</strong>
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-stretch">
            {/* Left Column (5 Cols on md+): Stream Frame Preview + Full-Width Channel Info Below */}
            <div className="md:col-span-5 w-full min-w-0 md:h-full flex flex-col justify-between gap-3 md:gap-4">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-zinc-800 shadow-xs shrink-0">
                <Image
                  src={mediaData.thumbnailUrl}
                  alt={mediaData.title}
                  fill
                  unoptimized
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-xs text-xs font-medium text-white">
                  <span className="text-[#53FC18] font-bold">KICK</span>
                  <span>•</span>
                  <span className="truncate max-w-[130px] font-normal">{mediaData.streamer.username}</span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded bg-black/75 text-white font-mono text-xs font-medium">
                  {mediaData.durationFormatted}
                </div>
              </div>

              {/* Full-Width Channel Info Container (matches preview thumbnail width, touch-friendly h-14 md:h-[70px], rounded-xl md:rounded-2xl) */}
              <div className="w-full h-14 md:h-[70px] px-3.5 sm:px-4 rounded-xl md:rounded-2xl bg-white dark:bg-[#121619] border border-slate-200 dark:border-zinc-800 shadow-2xs flex items-center gap-3 md:mt-auto shrink-0 min-w-0">
                <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden border border-slate-300 dark:border-zinc-700 shrink-0 bg-slate-100 dark:bg-zinc-800">
                  <Image
                    src={mediaData.streamer.avatarUrl}
                    alt={mediaData.streamer.displayName}
                    fill
                    unoptimized
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {mediaData.streamer.displayName}
                    </span>
                    {mediaData.streamer.verified && (
                      <span title="Verified Broadcaster" className="inline-flex items-center text-[#1d9bf0]" aria-label="Verified">
                        <BadgeCheck className="w-4 h-4 fill-current shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono font-normal truncate">
                    @{mediaData.streamer.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols on md+): Title, Mode Toggle, Clean Quality Pills, and Full-Width Download Button */}
            <div className="md:col-span-7 w-full min-w-0 md:h-full flex flex-col justify-between gap-4">
              {/* Top Wrapper: Groups Title, Mode Toggle, and Quality Selector Pills */}
              <div className="flex flex-col gap-3.5 sm:gap-4 w-full min-w-0">
                {/* Title with line-clamp-2 */}
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {mediaData.title}
                  </h2>
                </div>

                {/* Sleek, Compact Segmented Pill Control: [ VIDEO ] vs [ AUDIO ] */}
                <div className="w-full min-w-0">
                  <div className="grid grid-cols-2 p-1 rounded-xl bg-white dark:bg-[#121619] border border-slate-200 dark:border-zinc-800 gap-1 select-none">
                    <button
                      type="button"
                      onClick={() => setSelectedFormat('mpg')}
                      disabled={downloadState === 'downloading'}
                      className={`py-2 px-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all duration-150 cursor-pointer text-center disabled:opacity-50 flex items-center justify-center gap-1.5 min-w-0 ${
                        selectedFormat === 'mpg'
                          ? 'bg-[#53FC18] text-[#000000] shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/60 font-medium'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
                      <span className="truncate">{t.details.fullVideo}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFormat('mp3')}
                      disabled={downloadState === 'downloading'}
                      className={`py-2 px-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all duration-150 cursor-pointer text-center disabled:opacity-50 flex items-center justify-center gap-1.5 min-w-0 ${
                        selectedFormat === 'mp3'
                          ? 'bg-[#53FC18] text-[#000000] shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/60 font-medium'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
                      <span className="truncate">{t.details.onlyAudio}</span>
                    </button>
                  </div>
                </div>

                {/* Quality Selector: Unified Auto-Fitting Responsive Grid */}
                <div className="w-full min-w-0">
                  {selectedFormat === 'mpg' ? (
                    <div
                      className="grid gap-1 sm:gap-1.5 w-full min-w-0"
                      style={{
                        gridTemplateColumns: `repeat(${mediaData.qualities.length || 5}, minmax(0, 1fr))`,
                      }}
                    >
                      {mediaData.qualities.map((q) => {
                        const isSelected = selectedQuality === q.label;
                        const cleanLabel = formatQualityLabel(q.label);
                        return (
                          <button
                            key={q.label}
                            type="button"
                            onClick={() => setSelectedQuality(q.label)}
                            disabled={downloadState === 'downloading'}
                            className={`w-full min-w-0 py-2 sm:py-2.5 px-0.5 sm:px-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs md:text-sm font-mono transition-all duration-150 cursor-pointer border flex items-center justify-center text-center truncate disabled:opacity-50 select-none ${
                              isSelected
                                ? 'bg-[#53FC18] text-[#000000] border-[#53FC18] shadow-xs font-black'
                                : 'bg-white dark:bg-[#121619] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/60 font-semibold'
                            }`}
                            title={cleanLabel}
                          >
                            <span className="truncate uppercase tracking-tight">
                              {cleanLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="w-full min-w-0 py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl bg-[#53FC18] text-[#000000] border border-[#53FC18] shadow-xs font-mono font-bold text-xs sm:text-sm uppercase text-center flex items-center justify-center gap-2">
                      <Volume2 className="w-4 h-4 shrink-0" strokeWidth={2.2} />
                      <span className="truncate">{t.details.audioPill} • 320 KBPS MP3</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Action Button: Touch-Friendly h-14 on mobile, fixed h-[70px] on desktop, rounded-xl md:rounded-2xl */}
              <button
                type="button"
                onClick={startFullDownload}
                disabled={downloadState === 'downloading'}
                className="w-full h-14 md:h-[70px] px-4 sm:px-6 rounded-xl md:rounded-2xl bg-[#53FC18] text-[#000000] font-black text-sm sm:text-base hover:brightness-105 active:scale-[0.99] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-xs uppercase tracking-wider disabled:opacity-80 md:mt-auto shrink-0 select-none min-w-0"
              >
                {downloadState === 'downloading' ? (
                  <>
                    <span className="w-5 h-5 border-2 border-[#000000] border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="truncate">{selectedFormat === 'mp3' ? t.progress.downloadingAudio : t.progress.downloadingVideo}</span>
                  </>
                ) : downloadState === 'completed' ? (
                  <span>{t.details.downloadAgain}</span>
                ) : selectedFormat === 'mp3' ? (
                  <span>{t.details.downloadOnlyAudio}</span>
                ) : (
                  <span className="truncate">{`${t.details.downloadAction} ${formatQualityLabel(selectedQuality) || t.details.fullVideo}`}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Full-Width Separate Download Progress Bar Container */}
      {mediaData && (downloadState === 'downloading' || downloadState === 'completed' || downloadState === 'error') && (
        <div
          id="download-progress-container"
          className="mt-5 w-full max-w-4xl mx-auto bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-sm animate-fadeIn min-w-0 overflow-hidden"
        >
          {downloadState === 'downloading' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#53FC18] animate-pulse" />
                  <span className="font-bold text-slate-900 dark:text-white tracking-wider uppercase text-xs sm:text-sm">
                    {selectedFormat === 'mp3' ? t.progress.downloadingAudio : t.progress.downloadingVideo}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  {downloadStats.speedMb > 0 && (
                    <span className="font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-md text-[11px] border border-slate-200 dark:border-zinc-700 shadow-2xs">
                      {downloadStats.speedMb.toFixed(1)} MB/s
                    </span>
                  )}
                  {downloadStats.etaHuman && (
                    <span className="font-normal text-slate-500 dark:text-slate-400">
                      {t.progress.eta} {downloadStats.etaHuman}
                    </span>
                  )}
                </div>
              </div>

              {/* Clean, borderless progress bar track */}
              <div className="w-full h-3 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#53FC18] rounded-full transition-all duration-200"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>

              {/* Stats under the bar & cancel button */}
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 flex-wrap gap-2 pt-0.5 font-normal">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {downloadProgress}%
                  </span>
                  <span>•</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {(downloadStats.loadedBytes / (1024 * 1024)).toFixed(1)} MB / {downloadStats.totalBytes >= 1024 * 1024 * 1024
                      ? `${(downloadStats.totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
                      : `${(downloadStats.totalBytes / (1024 * 1024)).toFixed(1)} MB`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCancelDownload}
                  className="px-3.5 py-1 rounded-lg text-xs font-bold text-red-600 hover:text-red-700 dark:hover:text-red-400 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors cursor-pointer uppercase border border-red-200 dark:border-red-500/25 tracking-wider"
                >
                  {t.progress.cancel}
                </button>
              </div>
            </div>
          )}

          {downloadState === 'completed' && (
            <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#53FC18] text-[#000000] flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span>{t.progress.completeTitle}</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium border border-slate-200 dark:border-zinc-700">
                      {completedSize}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono truncate max-w-sm sm:max-w-md">
                    {t.progress.saved} {completedFilename}
                  </p>
                </div>
              </div>

              {completedBlobUrl && (
                <a
                  href={completedBlobUrl}
                  download={completedFilename || (selectedFormat === 'mp3' ? 'kick_audio.mp3' : 'kick_video.mpg')}
                  className="px-5 py-2 rounded-lg bg-[#53FC18] text-[#000000] text-xs sm:text-sm font-bold hover:brightness-105 transition-all shrink-0 uppercase tracking-wider shadow-xs"
                >
                  {t.progress.saveAgain}
                </a>
              )}
            </div>
          )}

          {downloadState === 'error' && (
            <div className="flex items-center justify-between gap-3 text-red-600 dark:text-red-400 text-xs sm:text-sm">
              <span>{downloadError || 'Download encountered an issue.'}</span>
              <button
                type="button"
                onClick={startFullDownload}
                className="font-bold underline hover:brightness-125 cursor-pointer uppercase tracking-wider shrink-0"
              >
                {t.progress.retry}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Dynamic Flow of the "PRO TIP" Box (stays at bottom of active flow) */}
      <div
        className="mt-6 w-full max-w-3xl mx-auto px-4 sm:px-5 py-3.5 rounded-xl bg-[#F1F5F9] dark:bg-[#181D20] border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center justify-center text-center shadow-sm"
      >
        <p className="font-normal leading-relaxed">
          <span className="me-1.5">💡</span>
          <strong className="text-slate-800 dark:text-white font-semibold">{t.proTip.label}</strong> {t.proTip.beforeWord}{' '}
          <span className="text-[#53FC18] font-bold">savethis</span>{' '}
          {t.proTip.afterWord}{' '}
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400" dir="ltr">
            {t.proTip.exampleBefore}<span className="text-[#53FC18] font-bold">savethis</span>{t.proTip.exampleAfter}
          </span>
        </p>
      </div>
    </section>
  );
}
