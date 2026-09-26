import muxjs from 'mux.js';

export interface PlaylistSegment {
  url: string;
  duration: number;
  byteRange?: { offset: number; length: number } | null;
  index: number;
}

export interface TransmuxProgress {
  loadedBytes: number;
  totalEstimatedBytes: number;
  speedMb: number;
  progressPercent: number;
  currentSegment: number;
  totalSegments: number;
  etaSeconds: number;
  etaHuman?: string;
  statusText: string;
}

export interface TransmuxOptions {
  playlistUrl: string;
  filename: string;
  preferredQuality?: string;
  startTimeSec?: number;
  endTimeSec?: number;
  estimatedTotalBytes?: number;
  isAudio?: boolean;
  signal?: AbortSignal;
  onProgress?: (progress: TransmuxProgress) => void;
}

export interface StreamWriter {
  write: (chunk: Uint8Array) => Promise<void>;
  close: () => Promise<void>;
  abort: (reason?: any) => Promise<void>;
  type: 'filesystem' | 'streamsaver' | 'blob';
  getBlobUrl?: () => string | null;
}

/**
 * Humanizes seconds into clean user-friendly remaining time (e.g., "~14 min remaining" or "~45s remaining").
 */
export function formatHumanEta(seconds: number): string {
  if (seconds <= 0) return '';
  if (seconds < 60) return `~${seconds}s remaining`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `~${minutes} min remaining`;
  const hours = Math.floor(minutes / 60);
  const remMins = minutes % 60;
  if (remMins === 0) return `~${hours}h remaining`;
  return `~${hours}h ${remMins}m remaining`;
}

/**
 * Creates a stream writer that writes directly to the user's hard drive chunk-by-chunk.
 * Uses File System Access API (showSaveFilePicker) first, falls back to StreamSaver.js.
 */
export async function createDirectFileWriter(filename: string, estimatedBytes?: number): Promise<StreamWriter> {
  const lowerName = filename.toLowerCase();
  const isMp3 = lowerName.endsWith('.mp3');

  const fileTypes = isMp3
    ? [
        {
          description: 'MP3 Audio (*.mp3)',
          accept: { 'audio/mpeg': ['.mp3'] },
        },
      ]
    : [
        {
          description: 'MPEG Video Stream (*.mpg)',
          accept: {
            'video/mpeg': ['.mpg'],
          },
        },
      ];

  // 1. Prioritize File System Access API (Chrome, Edge, Opera, Desktop Safari 15.2+)
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: fileTypes,
      });

      const writable = await handle.createWritable();
      return {
        type: 'filesystem',
        write: async (chunk: Uint8Array) => {
          await writable.write(chunk);
        },
        close: async () => {
          await writable.close();
        },
        abort: async (reason?: any) => {
          try {
            await writable.abort(reason);
          } catch {}
        },
      };
    } catch (err: any) {
      // If user deliberately canceled the save dialog, rethrow AbortError so caller stops
      if (err.name === 'AbortError') {
        throw err;
      }
      console.warn('showSaveFilePicker failed or was not allowed, falling back to StreamSaver:', err);
    }
  }

  // 2. Fallback to StreamSaver.js (Pipes stream directly into browser download manager without RAM bloat)
  if (typeof window !== 'undefined') {
    try {
      const streamSaverMod = await import('streamsaver');
      const streamSaver = streamSaverMod.default || streamSaverMod;

      const fileStream = streamSaver.createWriteStream(filename, {
        size: estimatedBytes && estimatedBytes > 0 ? estimatedBytes : undefined,
      });
      const writer = fileStream.getWriter();

      return {
        type: 'streamsaver',
        write: async (chunk: Uint8Array) => {
          await writer.write(chunk);
        },
        close: async () => {
          await writer.close();
        },
        abort: async (reason?: any) => {
          try {
            await writer.abort(reason);
          } catch {}
        },
      };
    } catch (err) {
      console.warn('StreamSaver initialization failed, falling back to chunk buffer:', err);
    }
  }

  // 3. Last-resort fallback for memory-restricted embedded browsers (e.g. mobile webviews)
  const chunks: (ArrayBuffer | ArrayBufferView)[] = [];
  let finalBlobUrl: string | null = null;

  return {
    type: 'blob',
    write: async (chunk: Uint8Array) => {
      chunks.push(chunk as unknown as ArrayBufferView);
    },
    close: async () => {
      const blob = new Blob(chunks as BlobPart[], { type: 'video/mp4' });
      finalBlobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = finalBlobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    abort: async () => {
      chunks.length = 0;
    },
    getBlobUrl: () => finalBlobUrl,
  };
}

/**
 * Fetches text content from a URL with automatic CORS fallback through server proxy.
 */
export async function fetchTextWithFallback(url: string, signal?: AbortSignal): Promise<string> {
  try {
    const res = await fetch(url, { signal });
    if (res.ok) return await res.text();
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
  }

  // Fallback via proxy
  const proxyUrl = `/api/kick/proxy?url=${encodeURIComponent(url)}`;
  const proxyRes = await fetch(proxyUrl, { signal });
  if (!proxyRes.ok) {
    throw new Error(`Failed to fetch playlist (HTTP ${proxyRes.status})`);
  }
  return await proxyRes.text();
}

/**
 * Fetches an ArrayBuffer segment with automatic CORS fallback and byte-range support.
 */
export async function fetchSegmentWithFallback(
  url: string,
  byteRange?: { offset: number; length: number } | null,
  signal?: AbortSignal
): Promise<ArrayBuffer> {
  const headers: Record<string, string> = {};
  if (byteRange) {
    headers['Range'] = `bytes=${byteRange.offset}-${byteRange.offset + byteRange.length - 1}`;
  }

  try {
    const res = await fetch(url, { headers, signal });
    if (res.ok || res.status === 206) {
      return await res.arrayBuffer();
    }
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
  }

  // Fallback via proxy
  const proxyUrl = `/api/kick/proxy?url=${encodeURIComponent(url)}`;
  const proxyRes = await fetch(proxyUrl, { headers, signal });
  if (!proxyRes.ok && proxyRes.status !== 206) {
    throw new Error(`Failed to fetch video chunk (HTTP ${proxyRes.status})`);
  }
  return await proxyRes.arrayBuffer();
}

/**
 * Parses an HLS playlist (master or variant) and returns target segments with timing.
 */
export async function resolveAndParseSegments(
  playlistUrl: string,
  preferredQuality?: string,
  startTimeSec?: number,
  endTimeSec?: number,
  signal?: AbortSignal
): Promise<{ segments: PlaylistSegment[]; totalDurationSec: number; variantUrl: string }> {
  const initialText = await fetchTextWithFallback(playlistUrl, signal);
  let variantUrl = playlistUrl;
  let variantText = initialText;

  // If this is a master playlist containing #EXT-X-STREAM-INF, locate the requested variant
  if (initialText.includes('#EXT-X-STREAM-INF:')) {
    const lines = initialText.split('\n').map((l) => l.trim()).filter(Boolean);
    let bestVariant: string | null = null;
    let exactMatch: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('#EXT-X-STREAM-INF:')) {
        const nextLine = lines[i + 1];
        if (nextLine && !nextLine.startsWith('#')) {
          const resolved = new URL(nextLine, playlistUrl).href;
          if (!bestVariant) bestVariant = resolved;
          if (preferredQuality && (line.includes(preferredQuality) || nextLine.includes(preferredQuality))) {
            exactMatch = resolved;
            break;
          }
        }
      }
    }

    variantUrl = exactMatch || bestVariant || playlistUrl;
    variantText = await fetchTextWithFallback(variantUrl, signal);
  }

  // Parse variant playlist segments
  const lines = variantText.split('\n').map((l) => l.trim()).filter(Boolean);
  const rawSegments: { url: string; duration: number; byteRange?: { offset: number; length: number } | null }[] = [];

  let currentByteRange: { offset: number; length: number } | null = null;
  let currentDuration = 0;
  let runningByteOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#EXT-X-BYTERANGE:')) {
      const rangeParts = line.substring(17).split('@');
      const length = parseInt(rangeParts[0], 10);
      const offset = rangeParts[1] !== undefined ? parseInt(rangeParts[1], 10) : runningByteOffset;
      runningByteOffset = offset + length;
      currentByteRange = { offset, length };
    } else if (line.startsWith('#EXTINF:')) {
      const durPart = line.substring(8).split(',')[0];
      currentDuration = parseFloat(durPart) || 0;
    } else if (!line.startsWith('#')) {
      const segUrl = new URL(line, variantUrl).href;
      rawSegments.push({
        url: segUrl,
        duration: currentDuration,
        byteRange: currentByteRange,
      });
      currentByteRange = null;
      currentDuration = 0;
    }
  }

  // Filter segments based on custom trim range if specified
  const filteredSegments: PlaylistSegment[] = [];
  let runningTimeSec = 0;
  let totalDurationSec = 0;

  for (let i = 0; i < rawSegments.length; i++) {
    const seg = rawSegments[i];
    const segStart = runningTimeSec;
    const segEnd = runningTimeSec + seg.duration;
    runningTimeSec = segEnd;

    if (startTimeSec !== undefined && endTimeSec !== undefined && endTimeSec > startTimeSec) {
      if (segEnd <= startTimeSec || segStart >= endTimeSec) {
        continue;
      }
    }

    filteredSegments.push({
      url: seg.url,
      duration: seg.duration,
      byteRange: seg.byteRange,
      index: filteredSegments.length,
    });
    totalDurationSec += seg.duration;
  }

  return {
    segments: filteredSegments,
    totalDurationSec,
    variantUrl,
  };
}

/**
 * Downloads HLS stream chunks, transmuxes MPEG-TS to genuine MP4 on the fly in browser,
 * and streams converted MP4 directly to the hard drive chunk-by-chunk with zero tab memory bloat.
 */
export async function downloadAndTransmuxHlsToMp4(
  options: TransmuxOptions,
  writer: StreamWriter
): Promise<{ totalBytes: number }> {
  const { playlistUrl, preferredQuality, startTimeSec, endTimeSec, signal, onProgress } = options;

  // Step 1: Resolve and parse the playlist segments
  onProgress?.({
    loadedBytes: 0,
    totalEstimatedBytes: options.estimatedTotalBytes || 0,
    speedMb: 0,
    progressPercent: 0,
    currentSegment: 0,
    totalSegments: 0,
    etaSeconds: 0,
    statusText: 'Analyzing stream playlist and chunks...',
  });

  const { segments, totalDurationSec } = await resolveAndParseSegments(
    playlistUrl,
    preferredQuality,
    startTimeSec,
    endTimeSec,
    signal
  );

  const totalSegments = segments.length;
  if (totalSegments === 0) {
    throw new Error('No valid video segments found in playlist.');
  }

  // Step 2: Initialize mux.js Transmuxer
  const transmuxer = new (muxjs as any).mp4.Transmuxer({
    remux: true,
    keepOriginalTimestamps: true,
  });

  let hasWrittenInitSegment = false;
  const transmuxedChunksQueue: Uint8Array[] = [];

  transmuxer.on('data', (segment: any) => {
    // 1. Write initialization segment (ftyp + moov boxes) ONCE at the start of the MP4 file
    if (!hasWrittenInitSegment && segment.initSegment && segment.initSegment.byteLength > 0) {
      transmuxedChunksQueue.push(segment.initSegment);
      hasWrittenInitSegment = true;
    }

    // 2. Write fragmented sample data (moof + mdat boxes)
    if (segment.data && segment.data.byteLength > 0) {
      transmuxedChunksQueue.push(segment.data);
    }
  });

  // Step 3: Iterate through segments, download, transmux, and flush directly to disk
  let totalTransmuxedBytesWritten = 0;
  let totalRawBytesDownloaded = 0;
  const startTime = Date.now();
  let lastSpeedTime = startTime;
  let lastSpeedBytes = 0;
  let currentSpeedMb = 0;

  for (let i = 0; i < totalSegments; i++) {
    if (signal?.aborted) {
      await writer.abort('Aborted by user');
      throw new Error('Download canceled.');
    }

    const seg = segments[i];

    // Fetch MPEG-TS chunk
    const chunkArrayBuffer = await fetchSegmentWithFallback(seg.url, seg.byteRange, signal);
    const chunkBytes = chunkArrayBuffer.byteLength;
    totalRawBytesDownloaded += chunkBytes;

    // Push TS chunk into transmuxer and flush
    transmuxer.push(new Uint8Array(chunkArrayBuffer));
    transmuxer.flush();

    // Write all produced MP4 chunks immediately to hard drive stream
    while (transmuxedChunksQueue.length > 0) {
      const part = transmuxedChunksQueue.shift()!;
      await writer.write(part);
      totalTransmuxedBytesWritten += part.byteLength;
    }

    // Calculate metrics
    const now = Date.now();
    const timeDelta = (now - lastSpeedTime) / 1000;
    if (timeDelta >= 0.35 || i === totalSegments - 1) {
      const bytesDelta = totalRawBytesDownloaded - lastSpeedBytes;
      currentSpeedMb = timeDelta > 0 ? bytesDelta / (1024 * 1024 * timeDelta) : 0;
      lastSpeedTime = now;
      lastSpeedBytes = totalRawBytesDownloaded;
    }

    // Progress percentage (0% to 99% during download/transmux, 100% after flush)
    const progressPct = Math.min(99, Math.round(((i + 1) / totalSegments) * 100));

    const elapsedSec = (now - startTime) / 1000;
    const avgSpeed = elapsedSec > 0 ? totalRawBytesDownloaded / elapsedSec : 0;
    const remainingSegments = totalSegments - (i + 1);
    const avgSegBytes = totalRawBytesDownloaded / (i + 1);
    const remainingBytes = remainingSegments * avgSegBytes;
    const etaSeconds = avgSpeed > 0 ? Math.ceil(remainingBytes / avgSpeed) : 0;

    const estimatedTotalTransmuxedBytes = Math.round((totalTransmuxedBytesWritten / (i + 1)) * totalSegments);

    onProgress?.({
      loadedBytes: totalTransmuxedBytesWritten,
      totalEstimatedBytes: estimatedTotalTransmuxedBytes,
      speedMb: currentSpeedMb,
      progressPercent: progressPct,
      currentSegment: i + 1,
      totalSegments,
      etaSeconds,
      etaHuman: formatHumanEta(etaSeconds),
      statusText: `Downloading Video (${progressPct}%)`,
    });
  }

  // Step 4: Finalize and flush the MP4 file to disk
  await writer.close();

  onProgress?.({
    loadedBytes: totalTransmuxedBytesWritten,
    totalEstimatedBytes: totalTransmuxedBytesWritten,
    speedMb: 0,
    progressPercent: 100,
    currentSegment: totalSegments,
    totalSegments,
    etaSeconds: 0,
    etaHuman: '',
    statusText: 'Download Complete!',
  });

  return { totalBytes: totalTransmuxedBytesWritten };
}

/**
 * Direct native MPEG stream downloader for 100% desktop player compatibility (Windows Media Player, Movies & TV, QuickTime).
 * Preserves the pristine H.264/AAC MPEG transport container chunks without demuxing jitter.
 */
export async function downloadAndSaveMpegStreamToFile(
  options: TransmuxOptions,
  writer: StreamWriter
): Promise<{ totalBytes: number }> {
  const { playlistUrl, preferredQuality, startTimeSec, endTimeSec, signal, onProgress, isAudio } = options;
  const label = isAudio ? 'Audio' : 'Video';

  onProgress?.({
    loadedBytes: 0,
    totalEstimatedBytes: options.estimatedTotalBytes || 0,
    speedMb: 0,
    progressPercent: 0,
    currentSegment: 0,
    totalSegments: 0,
    etaSeconds: 0,
    etaHuman: '',
    statusText: `Downloading ${label} (0%)`,
  });

  const { segments } = await resolveAndParseSegments(
    playlistUrl,
    preferredQuality,
    startTimeSec,
    endTimeSec,
    signal
  );

  const totalSegments = segments.length;
  if (totalSegments === 0) {
    throw new Error('No valid segments found in playlist.');
  }

  let totalBytesWritten = 0;
  const startTime = Date.now();
  let lastSpeedTime = startTime;
  let lastSpeedBytes = 0;
  let currentSpeedMb = 0;

  for (let i = 0; i < totalSegments; i++) {
    if (signal?.aborted) {
      await writer.abort('Aborted by user');
      throw new Error('Download canceled.');
    }

    const seg = segments[i];
    const chunkArrayBuffer = await fetchSegmentWithFallback(seg.url, seg.byteRange, signal);
    const chunkBytes = chunkArrayBuffer.byteLength;

    await writer.write(new Uint8Array(chunkArrayBuffer));
    totalBytesWritten += chunkBytes;

    const now = Date.now();
    const timeDelta = (now - lastSpeedTime) / 1000;
    if (timeDelta >= 0.35 || i === totalSegments - 1) {
      const bytesDelta = totalBytesWritten - lastSpeedBytes;
      currentSpeedMb = timeDelta > 0 ? bytesDelta / (1024 * 1024 * timeDelta) : 0;
      lastSpeedTime = now;
      lastSpeedBytes = totalBytesWritten;
    }

    const progressPct = Math.min(99, Math.round(((i + 1) / totalSegments) * 100));
    const elapsedSec = (now - startTime) / 1000;
    const avgSpeed = elapsedSec > 0 ? totalBytesWritten / elapsedSec : 0;
    const remainingSegments = totalSegments - (i + 1);
    const avgSegBytes = totalBytesWritten / (i + 1);
    const remainingBytes = remainingSegments * avgSegBytes;
    const etaSeconds = avgSpeed > 0 ? Math.ceil(remainingBytes / avgSpeed) : 0;

    const estimatedTotalBytes = Math.round((totalBytesWritten / (i + 1)) * totalSegments);

    onProgress?.({
      loadedBytes: totalBytesWritten,
      totalEstimatedBytes: estimatedTotalBytes,
      speedMb: currentSpeedMb,
      progressPercent: progressPct,
      currentSegment: i + 1,
      totalSegments,
      etaSeconds,
      etaHuman: formatHumanEta(etaSeconds),
      statusText: `Downloading ${label} (${progressPct}%)`,
    });
  }

  await writer.close();

  onProgress?.({
    loadedBytes: totalBytesWritten,
    totalEstimatedBytes: totalBytesWritten,
    speedMb: 0,
    progressPercent: 100,
    currentSegment: totalSegments,
    totalSegments,
    etaSeconds: 0,
    etaHuman: '',
    statusText: 'Download Complete!',
  });

  return { totalBytes: totalBytesWritten };
}

/**
 * Streams a direct video/audio URL chunk-by-chunk directly to disk with live progress.
 */
export async function downloadDirectStreamToFile(
  url: string,
  writer: StreamWriter,
  expectedBytes?: number,
  signal?: AbortSignal,
  onProgress?: (progress: TransmuxProgress) => void,
  isAudio?: boolean
): Promise<{ totalBytes: number }> {
  const label = isAudio ? 'Audio' : 'Video';
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Direct download failed with HTTP ${res.status}`);
  }

  const contentLengthHeader = res.headers.get('content-length');
  const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : (expectedBytes || 0);

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('ReadableStream not supported by browser.');
  }

  let receivedBytes = 0;
  const startTime = Date.now();
  let lastSpeedTime = startTime;
  let lastSpeedBytes = 0;
  let currentSpeedMb = 0;

  while (true) {
    if (signal?.aborted) {
      await writer.abort('Aborted by user');
      throw new Error('Download canceled.');
    }

    const { done, value } = await reader.read();
    if (done) break;

    if (value) {
      await writer.write(value);
      receivedBytes += value.byteLength;

      const now = Date.now();
      const timeDelta = (now - lastSpeedTime) / 1000;
      if (timeDelta >= 0.35) {
        const bytesDelta = receivedBytes - lastSpeedBytes;
        currentSpeedMb = timeDelta > 0 ? bytesDelta / (1024 * 1024 * timeDelta) : 0;
        lastSpeedTime = now;
        lastSpeedBytes = receivedBytes;
      }

      const effectiveTotal = totalBytes > 0 ? totalBytes : Math.round(receivedBytes * 1.2);
      const pct = totalBytes > 0 ? Math.min(99, Math.round((receivedBytes / totalBytes) * 100)) : 50;
      const remainingBytes = Math.max(0, effectiveTotal - receivedBytes);
      const etaSeconds = currentSpeedMb > 0 ? Math.ceil(remainingBytes / (currentSpeedMb * 1024 * 1024)) : 0;

      onProgress?.({
        loadedBytes: receivedBytes,
        totalEstimatedBytes: effectiveTotal,
        speedMb: currentSpeedMb,
        progressPercent: pct,
        currentSegment: 1,
        totalSegments: 1,
        etaSeconds,
        etaHuman: formatHumanEta(etaSeconds),
        statusText: `Downloading ${label} (${pct}%)`,
      });
    }
  }

  await writer.close();

  onProgress?.({
    loadedBytes: receivedBytes,
    totalEstimatedBytes: receivedBytes,
    speedMb: 0,
    progressPercent: 100,
    currentSegment: 1,
    totalSegments: 1,
    etaSeconds: 0,
    etaHuman: '',
    statusText: 'Download Complete!',
  });

  return { totalBytes: receivedBytes };
}

