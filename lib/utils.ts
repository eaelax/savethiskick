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

/**
 * Accurately parses user input with robust Regex to capture specific VOD ID / UUID:
 * 1. Standard VOD URLs: https://kick.com/video/{video-uuid}
 * 2. User video URLs: https://kick.com/{channel}/videos/{video-uuid}
 * 3. Custom prefix domain: https://savethiskick.com/{path}
 * 4. Clips: https://kick.com/clips/{clip_id} or ?clip={clip_id}
 * 5. Channel only: https://kick.com/{channel}
 */
export function parseKickTarget(input: string): KickTargetParsed | null {
  if (!input) return null;
  const raw = input.trim();

  // 1. Raw UUID / ULID entered directly (e.g. 01a0b543-7888-7b08-ba57-bc5a6ea4e411 or f0fe954e-514a-4682-ab88-b8017645dce5)
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (uuidRegex.test(raw)) {
    return {
      type: 'vod',
      videoId: raw,
      rawInput: input,
    };
  }

  // 2. Pure clip ID entered directly (e.g. clip_01H811MXG4FBR62FXPE1AXABDH)
  if (/^clip_[a-zA-Z0-9_-]+$/i.test(raw)) {
    return {
      type: 'clip',
      clipId: raw,
      rawInput: input,
    };
  }

  // 3. Plain username starting with @
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

  // Normalize by stripping protocol and host prefixes (kick.com, savethiskick.com, etc.)
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
  // Strip trailing slashes and hash
  pathname = pathname.split('#')[0].replace(/\/+$/, '');

  // Check ?clip={clip_id} query parameter
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

  // 4. REGEX A: Standard VOD URL: /video/{video-uuid} or /videos/{video-uuid}
  const standardVodMatch = pathname.match(/^videos?\/([0-9a-fA-F-]+|[a-zA-Z0-9_-]+)$/i);
  if (standardVodMatch && standardVodMatch[1]) {
    return {
      type: 'vod',
      videoId: standardVodMatch[1],
      rawInput: input,
    };
  }

  // 5. REGEX B: User video URL: /{channel}/videos/{video-uuid} or /{channel}/video/{video-uuid}
  const userVodMatch = pathname.match(/^([a-zA-Z0-9_]+)\/videos?\/([0-9a-fA-F-]+|[a-zA-Z0-9_-]+)$/i);
  if (userVodMatch && userVodMatch[1] && userVodMatch[2]) {
    return {
      type: 'vod',
      videoId: userVodMatch[2],
      channelSlug: userVodMatch[1].toLowerCase(),
      rawInput: input,
    };
  }

  // 6. REGEX C: Clips: /clips/{clip_id} or /{channel}/clips/{clip_id}
  const clipMatch = pathname.match(/^(?:([a-zA-Z0-9_]+)\/)?clips?\/([a-zA-Z0-9_-]+)$/i);
  if (clipMatch && clipMatch[2]) {
    return {
      type: 'clip',
      clipId: clipMatch[2],
      channelSlug: clipMatch[1] ? clipMatch[1].toLowerCase() : undefined,
      rawInput: input,
    };
  }

  // 7. Channel subpaths without specific ID: /{channel}/videos, /{channel}/clips, /{channel}/about
  const channelSubTabMatch = pathname.match(/^([a-zA-Z0-9_]+)\/(?:videos|clips|about|community)\/?$/i);
  if (channelSubTabMatch && channelSubTabMatch[1]) {
    return {
      type: 'channel',
      channelSlug: channelSubTabMatch[1].toLowerCase(),
      rawInput: input,
    };
  }

  // 8. Single segment path
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

/**
 * Sanitizes a string for safe use as a downloaded filename across all operating systems
 */
export function sanitizeFilename(name: string, ext = 'mpg'): string {
  const safeExt = ext.replace(/^\./, '').toLowerCase();
  // Remove dangerous OS characters: / \ ? % * : | " < > # and control characters
  let clean = (name || 'kick_video')
    .replace(/[/\\?%*:|"<>#\x00-\x1f\x7f-\x9f]/g, '_')
    .replace(/\s+/g, ' ')
    .replace(/_+/g, '_')
    .trim();

  // Strip existing extension if already matching
  const extRegex = new RegExp(`\\.${safeExt}$`, 'i');
  clean = clean.replace(extRegex, '').trim();

  if (!clean || clean === '_' || clean === '-') {
    clean = 'kick_video';
  }

  // Enforce reasonable max length
  if (clean.length > 150) {
    clean = clean.substring(0, 150).trim();
  }

  return `${clean}.${safeExt}`;
}
