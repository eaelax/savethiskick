import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface KickTargetParsed {
  type: 'vod' | 'clip' | 'channel';
  videoId?: string;
  clipId?: string;
  channelSlug?: string;
  rawInput: string;
}

/**
 * Formats a duration given in seconds or milliseconds into HH:MM:SS (or MM:SS if under 1 hour).
 * Handles both seconds and milliseconds (if value > 100,000, divides by 1000).
 */
export function formatDuration(secondsOrMs: number | string | undefined | null): string {
  if (secondsOrMs === undefined || secondsOrMs === null) return '00:00';
  const num = typeof secondsOrMs === 'string' ? parseFloat(secondsOrMs) : Number(secondsOrMs);
  if (isNaN(num) || num <= 0) return '00:00';

  // If value > 100,000, it is milliseconds (e.g. 5,000,000 ms = 5,000 sec)
  const totalSeconds = Math.round(num > 100000 ? num / 1000 : num);

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Normalizes any Kick or SaveThisKick URL into a clean, valid https://kick.com/... URL
 */
export function normalizeKickUrl(input: string): string {
  if (!input) return '';
  let url = input.trim();

  // Strip protocol
  url = url.replace(/^https?:\/\//i, '');

  // Strip leading helper domains
  url = url.replace(/^(?:www\.)?(?:savethis\.)?(?:savethiskick\.com|kick\.com)\/?/i, '');
  url = url.replace(/^(?:www\.)?savethis(?:kick)?\.com\/?/i, '');
  url = url.replace(/^(?:www\.)?kick\.com\/?/i, '');

  // Handle any duplicate slashes
  url = url.replace(/^\/+/, '');

  if (!url) return '';

  return `https://kick.com/${url}`;
}

export function parseKickTarget(input: string): KickTargetParsed | null {
  if (!input) return null;
  const raw = input.trim();

  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (uuidRegex.test(raw)) {
    return {
      type: 'vod',
      videoId: raw,
      rawInput: input,
    };
  }

  if (/^clip_[a-zA-Z0-9_-]+$/i.test(raw)) {
    return {
      type: 'clip',
      clipId: raw,
      rawInput: input,
    };
  }

  if (raw.startsWith('@')) {
    const slug = raw.slice(1).replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    if (slug) {
      return {
        type: 'channel',
        channelSlug: slug,
        rawInput: input,
      };
    }
  }

  let clean = raw.replace(/^https?:\/\//i, '');
  clean = clean.replace(/^(?:www\.)?(?:savethis\.)?(?:savethiskick\.com|kick\.com)\/?/i, '');
  clean = clean.replace(/^(?:www\.)?savethis(?:kick)?\.com\/?/i, '');
  clean = clean.replace(/^(?:www\.)?kick\.com\/?/i, '');
  clean = clean.replace(/^\/+/, '');

  let pathname = clean;
  let searchParams = new URLSearchParams();
  if (clean.includes('?')) {
    const parts = clean.split('?');
    pathname = parts[0];
    searchParams = new URLSearchParams(parts[1]);
  }
  pathname = pathname.split('#')[0].replace(/\/+$/, '');

  const clipQuery = searchParams.get('clip');
  if (clipQuery) {
    const channelPart = pathname.split('/')[0];
    const isChannel = channelPart && !['video', 'videos', 'clip', 'clips'].includes(channelPart.toLowerCase());
    return {
      type: 'clip',
      clipId: clipQuery,
      channelSlug: isChannel ? channelPart.toLowerCase() : undefined,
      rawInput: input,
    };
  }

  const standardVodMatch = pathname.match(/^videos?\/([0-9a-fA-F-]+|[a-zA-Z0-9_-]+)$/i);
  if (standardVodMatch && standardVodMatch[1]) {
    return {
      type: 'vod',
      videoId: standardVodMatch[1],
      rawInput: input,
    };
  }

  const userVodMatch = pathname.match(/^([a-zA-Z0-9_]+)\/videos?\/([0-9a-fA-F-]+|[a-zA-Z0-9_-]+)$/i);
  if (userVodMatch && userVodMatch[1] && userVodMatch[2]) {
    return {
      type: 'vod',
      videoId: userVodMatch[2],
      channelSlug: userVodMatch[1].toLowerCase(),
      rawInput: input,
    };
  }

  const clipMatch = pathname.match(/^(?:([a-zA-Z0-9_]+)\/)?clips?\/([a-zA-Z0-9_-]+)$/i);
  if (clipMatch && clipMatch[2]) {
    return {
      type: 'clip',
      clipId: clipMatch[2],
      channelSlug: clipMatch[1] ? clipMatch[1].toLowerCase() : undefined,
      rawInput: input,
    };
  }

  const channelSubTabMatch = pathname.match(/^([a-zA-Z0-9_]+)\/(?:videos|clips|about|community)\/?$/i);
  if (channelSubTabMatch && channelSubTabMatch[1]) {
    return {
      type: 'channel',
      channelSlug: channelSubTabMatch[1].toLowerCase(),
      rawInput: input,
    };
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1) {
    const single = segments[0];
    if (uuidRegex.test(single)) {
      return {
        type: 'vod',
        videoId: single,
        rawInput: input,
      };
    }
    if (/^clip_/i.test(single)) {
      return {
        type: 'clip',
        clipId: single,
        rawInput: input,
      };
    }
    return {
      type: 'channel',
      channelSlug: single.toLowerCase(),
      rawInput: input,
    };
  }

  if (segments.length > 0) {
    return {
      type: 'channel',
      channelSlug: segments[0].toLowerCase(),
      rawInput: input,
    };
  }

  return null;
}

export function sanitizeFilename(name: string, ext = 'mpg'): string {
  const safeExt = ext.replace(/^\./, '').toLowerCase();
  let clean = (name || 'kick_video')
    .replace(/[/\\?%*:|"<>#\x00-\x1f\x7f-\x9f]/g, '_')
    .replace(/\s+/g, ' ')
    .replace(/_+/g, '_')
    .trim();

  const extRegex = new RegExp(`\\.${safeExt}$`, 'i');
  clean = clean.replace(extRegex, '').trim();

  if (!clean || clean === '_' || clean === '-') {
    clean = 'kick_video';
  }

  if (clean.length > 150) {
    clean = clean.substring(0, 150).trim();
  }

  return `${clean}.${safeExt}`;
}
