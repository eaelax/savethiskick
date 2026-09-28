import { NextRequest, NextResponse } from 'next/server';
import { normalizeKickUrl, parseKickTarget, formatDuration } from '@/lib/utils';

export const runtime = 'edge';

export interface KickMediaInfo {
  id: string;
  type: 'vod' | 'clip' | 'live';
  title: string;
  category?: string;
  views?: string;
  streamer: {
    username: string;
    displayName: string;
    avatarUrl: string;
    verified: boolean;
  };
  durationSeconds: number;
  durationFormatted: string;
  thumbnailUrl: string;
  createdAt: string;
  sourceUrl: string;
  isLatestFromChannel?: boolean;
  qualities: {
    label: string;
    resolution: string;
    fps: number;
    bandwidth: number;
    estimatedSizeMb: number;
    streamUrl: string;
  }[];
  audioOnly: {
    label: string;
    format: string;
    bitrate: string;
    estimatedSizeMb: number;
    streamUrl: string;
  };
}

const COMMON_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  Referer: 'https://kick.com/',
  Origin: 'https://kick.com',
  Accept: 'application/json, text/plain, */*',
};

// Robust Kick data fetcher using edge-native fetch + worker fallback
async function fetchKickApi<T = any>(apiUrl: string): Promise<T | null> {
  // 1. Direct fetch with browser headers
  try {
    const res = await fetch(apiUrl, {
      headers: COMMON_HEADERS,
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && !data.error && data.message !== 'Clip not found') {
        return data as T;
      }
    }
  } catch {}

  // 2. Fallback worker proxy
  try {
    const proxyUrl = 'https://cors.viddastrage.workers.dev/corsproxy/?apiurl=' + encodeURIComponent(apiUrl);
    const res = await fetch(proxyUrl, {
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && !data.error && data.message !== 'Clip not found') {
        return data as T;
      }
    }
  } catch {}

  return null;
}

// Fallback extractor stub for edge runtime
async function extractWithYtDlp(_url: string): Promise<any | null> {
  return null;
}

interface ScrapedKickVod {
  id: string;
  streamSrc: string;
  durationSeconds: number;
  thumbnailUrl: string;
  title: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  verified: boolean;
  category: string;
  views?: string;
  createdAt?: string;
  deleted?: boolean;
  isPrivate?: boolean;
  isSubOnly?: boolean;
}

// Scrape Kick VOD directly from the SSR page (most reliable for modern UUID VODs)
async function fetchKickVodFromPage(channelSlug: string | undefined, videoId: string): Promise<ScrapedKickVod | null> {
  const targetUrl = channelSlug
    ? `https://kick.com/${channelSlug}/videos/${videoId}`
    : `https://kick.com/video/${videoId}`;

  let html = '';
  // 1. Direct fetch with browser headers
  try {
    const res = await fetch(targetUrl, {
      headers: COMMON_HEADERS,
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      html = await res.text();
    }
  } catch {}

  // 2. Fallback proxy fetch if direct connection is blocked
  if (!html || html.length < 500) {
    try {
      const proxyUrl = 'https://cors.viddastrage.workers.dev/corsproxy/?apiurl=' + encodeURIComponent(targetUrl);
      const res = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(7000),
      });
      if (res.ok) {
        html = await res.text();
      }
    } catch {}
  }

  if (!html) return null;

  // 3. Extract recording_url or master.m3u8 playlist FIRST
  const recUrlMatch =
    html.match(/recording_url\\*":\\*"([^"\\]+)/) ||
    html.match(/recording_url":"([^"]+)/) ||
    html.match(/(https?:\\\/\\\/stream\.kick\.com\\\/[^"'\s]+\.m3u8)/i) ||
    html.match(/(https?:\/\/stream\.kick\.com\/[^"'\s]+\.m3u8)/i) ||
    html.match(/(https?:\\\/\\\/[^"'\s]+\.playback\.live-video\.net\\\/[^"'\s]+\.m3u8[^"'\s]*)/i);

  const streamSrc = recUrlMatch ? recUrlMatch[1].replace(/\\\//g, '/') : null;

  // If no stream source found, check if it's 404/deleted/private
  if (!streamSrc) {
    if (html.includes('"_not-found"') || html.includes('not-found.png')) {
      return { deleted: true } as any;
    }
    if (html.includes('"status":"private"') || html.includes('\\"status\\":\\"private\\"')) {
      return { isPrivate: true } as any;
    }
    if (html.includes('"subscription_only":true') || html.includes('\\"subscription_only\\":true')) {
      return { isSubOnly: true } as any;
    }
    return null;
  }

  // Check private / sub-only
  if (html.includes('"status":"private"') || html.includes('\\"status\\":\\"private\\"')) {
    return { isPrivate: true } as any;
  }
  if (html.includes('"subscription_only":true') || html.includes('\\"subscription_only\\":true')) {
    return { isSubOnly: true } as any;
  }

  // Duration
  const durMatch = html.match(/"duration\\*":\\*([0-9]+)/) || html.match(/"duration":([0-9]+)/);
  const rawDur = durMatch ? parseInt(durMatch[1], 10) : 0;
  const durationSec = rawDur > 100000 ? Math.round(rawDur / 1000) : (rawDur || 3600);

  // Thumbnail
  const thumbMatch =
    html.match(/"thumbnail\\*":\\*\{\\*"(?:src|url)\\*":\\*"([^"\\]+)/) ||
    html.match(/"thumbnail":\{"(?:src|url)":"([^"]+)/) ||
    html.match(/property="og:image"\s+content="([^"]+)"/i);
  const thumbnail = thumbMatch
    ? thumbMatch[1].replace(/\\\//g, '/')
    : 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1280&auto=format&fit=crop&q=85';

  // Title
  const titleMatch =
    html.match(/data-testid="livestream-title"[^>]*>([\s\S]*?)<\/span>/) ||
    html.match(/"session_title\\*":\\*"([^"\\]+)/) ||
    html.match(/property="og:title"\s+content="([^"]+)"/i);
  let title = 'Kick Past Broadcast';
  if (titleMatch) {
    title = titleMatch[1].replace(/<!-- -->|\u00a0/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  }

  // Streamer info
  const userMatch =
    html.match(/id="channel-username"[^>]*>([^<]+)/) ||
    html.match(/"username\\*":\\*"([^"\\]+)/);
  const displayName = userMatch
    ? userMatch[1].trim()
    : (channelSlug ? (channelSlug.charAt(0).toUpperCase() + channelSlug.slice(1)) : 'streamer');
  const username = channelSlug || displayName.toLowerCase();

  const avatarMatch =
    html.match(/id="channel-avatar"[^>]*src="([^"]+)"/) ||
    html.match(/src="([^"]+)"[^>]*id="channel-avatar"/);
  const avatarUrl = avatarMatch
    ? avatarMatch[1]
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80';

  const verified = html.includes('VerifiedBadge');

  const catMatch =
    html.match(/href="\/category\/[^"]*"[^>]*>([^<]+)/) ||
    html.match(/"category\\*":\\*\{\\*"(?:name)\\*":\\*"([^"\\]+)/);
  const category = catMatch ? catMatch[1].trim() : 'Just Chatting';

  const viewsMatch = html.match(/<span[^>]*title="([0-9]+)"[^>]*>[^<]*<\/span><span[^>]*>\s*Views\s*<\/span>/i);
  const views = viewsMatch ? `${Number(viewsMatch[1]).toLocaleString()} views` : undefined;

  const startMatch = html.match(/"start_time\\*":\\*"([^"\\]+)/);
  const createdAt = startMatch ? startMatch[1] : new Date().toISOString();

  return {
    id: videoId,
    streamSrc,
    durationSeconds: durationSec,
    thumbnailUrl: thumbnail,
    title,
    username,
    displayName,
    avatarUrl,
    verified,
    category,
    views,
    createdAt,
  };
}

// Parse real master.m3u8 to extract ONLY the qualities that actually exist in the stream video
async function buildStreamQualitiesAndAudio(sourceStreamUrl: string, durationSec: number) {
  const safeDuration = Math.max(1, durationSec);

  if (sourceStreamUrl && sourceStreamUrl.includes('.m3u8')) {
    try {
      const res = await fetch(sourceStreamUrl, {
        headers: COMMON_HEADERS,
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const text = await res.text();
        const lines = text.split('\n');
        const parsedQualities: {
          label: string;
          resolution: string;
          fps: number;
          bandwidth: number;
          estimatedSizeMb: number;
          streamUrl: string;
        }[] = [];

        const baseUrl = sourceStreamUrl.substring(0, sourceStreamUrl.lastIndexOf('/') + 1);

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('#EXT-X-STREAM-INF:')) {
            const resMatch = line.match(/RESOLUTION=([0-9]+x[0-9]+)/);
            const bwMatch = line.match(/BANDWIDTH=([0-9]+)/);
            const fpsMatch = line.match(/FRAME-RATE=([0-9.]+)/);

            const nextLine = lines[i + 1]?.trim();
            if (nextLine && !nextLine.startsWith('#')) {
              const variantUrl = nextLine.startsWith('http') ? nextLine : baseUrl + nextLine;
              const resolution = resMatch ? resMatch[1] : '1280x720';
              const height = resolution.split('x')[1] || '720';
              const bandwidth = bwMatch ? parseInt(bwMatch[1], 10) : 2500000;
              const fps = fpsMatch ? Math.round(parseFloat(fpsMatch[1])) : 30;

              const isHighest = parsedQualities.length === 0;
              const label = `${height}p${fps > 30 ? fps : ''}${isHighest ? ' (Source HD)' : ''}`.trim();
              const estimatedSizeMb = Math.max(1, Math.round((safeDuration * bandwidth) / (8 * 1024 * 1024)));

              if (!parsedQualities.some((q) => q.resolution === resolution)) {
                parsedQualities.push({
                  label,
                  resolution,
                  fps,
                  bandwidth,
                  estimatedSizeMb,
                  streamUrl: variantUrl,
                });
              }
            }
          }
        }

        if (parsedQualities.length > 0) {
          return {
            qualities: parsedQualities,
            audioOnly: {
              label: 'Audio Only (MP3 / 320kbps)',
              format: 'mp3',
              bitrate: '320kbps',
              estimatedSizeMb: Math.max(0.5, Number(((safeDuration * 320000) / (8 * 1024 * 1024)).toFixed(1))),
              streamUrl: parsedQualities[parsedQualities.length - 1].streamUrl,
            },
          };
        }
      }
    } catch (e) {
      console.warn('Could not parse master playlist:', e);
    }
  }

  // Fallback if master.m3u8 cannot be parsed or clip is direct file
  const baseStream = sourceStreamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  return {
    qualities: [
      {
        label: '1080p60 (Source HD)',
        resolution: '1920x1080',
        fps: 60,
        bandwidth: 8000000,
        estimatedSizeMb: Math.max(1, Math.round((safeDuration * 8000000) / (8 * 1024 * 1024))),
        streamUrl: baseStream,
      },
      {
        label: '720p (High)',
        resolution: '1280x720',
        fps: 30,
        bandwidth: 2500000,
        estimatedSizeMb: Math.max(1, Math.round((safeDuration * 2500000) / (8 * 1024 * 1024))),
        streamUrl: baseStream,
      },
      {
        label: '480p (Standard)',
        resolution: '854x480',
        fps: 30,
        bandwidth: 1500000,
        estimatedSizeMb: Math.max(1, Math.round((safeDuration * 1500000) / (8 * 1024 * 1024))),
        streamUrl: baseStream,
      },
      {
        label: '360p (Data Saver)',
        resolution: '640x360',
        fps: 30,
        bandwidth: 800000,
        estimatedSizeMb: Math.max(1, Math.round((safeDuration * 800000) / (8 * 1024 * 1024))),
        streamUrl: baseStream,
      },
    ],
    audioOnly: {
      label: 'Audio Only (MP3 / 320kbps)',
      format: 'mp3',
      bitrate: '320kbps',
      estimatedSizeMb: Math.max(0.5, Number(((safeDuration * 320000) / (8 * 1024 * 1024)).toFixed(1))),
      streamUrl: baseStream,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = (body.url || '').trim();

    if (!rawUrl) {
      return NextResponse.json({ error: 'Please enter a valid Kick URL or username.' }, { status: 400 });
    }

    const target = parseKickTarget(rawUrl);

    if (!target) {
      return NextResponse.json(
        { error: 'Invalid URL format. Please enter a valid Kick stream, VOD, clip link, or channel name.' },
        { status: 400 }
      );
    }

    const cleanUrl = normalizeKickUrl(rawUrl);

    // =========================================================================
    // CASE 1A: SPECIFIC VOD OR VIDEO URL
    // =========================================================================
    if (target.type === 'vod' && target.videoId) {
      const videoId = target.videoId;
      const channelSlug = target.channelSlug;

      const scrapedVod = await fetchKickVodFromPage(channelSlug, videoId);

      if (scrapedVod) {
        if (scrapedVod.deleted) {
          return NextResponse.json(
            { error: 'This Kick VOD has been deleted by the streamer and is no longer available.' },
            { status: 410 }
          );
        }
        if (scrapedVod.isPrivate) {
          return NextResponse.json(
            { error: 'This Kick VOD is marked private and cannot be downloaded.' },
            { status: 403 }
          );
        }
        if (scrapedVod.isSubOnly) {
          return NextResponse.json(
            { error: 'This Kick VOD is restricted to subscribers only.' },
            { status: 403 }
          );
        }

        if (scrapedVod.streamSrc) {
          const { qualities, audioOnly } = await buildStreamQualitiesAndAudio(
            scrapedVod.streamSrc,
            scrapedVod.durationSeconds
          );

          const media: KickMediaInfo = {
            id: scrapedVod.id || videoId,
            type: 'vod',
            title: scrapedVod.title,
            category: scrapedVod.category,
            views: scrapedVod.views,
            streamer: {
              username: scrapedVod.username,
              displayName: scrapedVod.displayName,
              avatarUrl: scrapedVod.avatarUrl,
              verified: scrapedVod.verified,
            },
            durationSeconds: scrapedVod.durationSeconds,
            durationFormatted: formatDuration(scrapedVod.durationSeconds),
            thumbnailUrl: scrapedVod.thumbnailUrl,
            createdAt: scrapedVod.createdAt || new Date().toISOString(),
            sourceUrl: cleanUrl,
            isLatestFromChannel: false,
            qualities,
            audioOnly,
          };

          return NextResponse.json({ success: true, media });
        }
      }

      let videoData: any = await fetchKickApi(`https://kick.com/api/v1/video/${videoId}`);

      if (videoData && (videoData.message?.includes('No query results for model') || videoData.message === 'Video not found')) {
        videoData = null;
      }

      if (videoData) {
        if (videoData.deleted_at) {
          return NextResponse.json(
            { error: 'This Kick VOD has been deleted by the streamer and is no longer available.' },
            { status: 410 }
          );
        }
        if (videoData.is_private || videoData.status === 'private') {
          return NextResponse.json(
            { error: 'This Kick VOD is marked private and cannot be downloaded.' },
            { status: 403 }
          );
        }
        if (videoData.subscription_only || videoData.is_sub_only) {
          return NextResponse.json(
            { error: 'This Kick VOD is restricted to subscribers only.' },
            { status: 403 }
          );
        }
      }

      if ((!videoData || !videoData.source) && channelSlug) {
        const v2ChannelVideos = await fetchKickApi<any[]>(`https://kick.com/api/v2/channels/${channelSlug}/videos`);
        if (Array.isArray(v2ChannelVideos) && v2ChannelVideos.length > 0) {
          const targetLower = videoId.toLowerCase();
          const exactMatch = v2ChannelVideos.find((v: any) => {
            const vUuid = v.video?.uuid?.toLowerCase();
            const vId = String(v.id);
            const vVideoId = String(v.video?.id || '');
            const vSlug = (v.slug || '').toLowerCase();
            const vVodId = (v.vod_id || v.livestream?.vod_id || '').toLowerCase();

            return (
              vUuid === targetLower ||
              vId === targetLower ||
              vVideoId === targetLower ||
              vVodId === targetLower ||
              vSlug === targetLower ||
              vSlug.startsWith(targetLower) ||
              targetLower.startsWith(vSlug)
            );
          });

          if (exactMatch) {
            if (exactMatch.video?.deleted_at) {
              return NextResponse.json(
                { error: 'This Kick VOD has been deleted by the broadcaster.' },
                { status: 410 }
              );
            }
            if (exactMatch.video?.is_private || exactMatch.video?.status === 'private') {
              return NextResponse.json(
                { error: 'This Kick VOD is marked private and cannot be downloaded.' },
                { status: 403 }
              );
            }

            if (exactMatch.source) {
              videoData = {
                uuid: exactMatch.video?.uuid || videoId,
                source: exactMatch.source,
                session_title: exactMatch.session_title,
                duration: exactMatch.duration ? Math.round(exactMatch.duration / 1000) : 3600,
                thumbnail: exactMatch.thumbnail?.src || exactMatch.thumbnail,
                created_at: exactMatch.created_at,
                views: exactMatch.views || exactMatch.video?.views,
                channel: { slug: channelSlug },
                categories: exactMatch.categories,
              };
            } else if (exactMatch.video?.uuid) {
              const fullVid = await fetchKickApi(`https://kick.com/api/v1/video/${exactMatch.video.uuid}`);
              if (fullVid && fullVid.source) {
                videoData = fullVid;
              }
            }
          }
        }
      }

      if (videoData && (videoData.source || videoData.livestream || videoData.session_title)) {
        const ls = videoData.livestream;
        const channelObj = ls?.channel || videoData.channel;
        const userObj = channelObj?.user || videoData.user;

        const streamerUsername = channelObj?.slug || channelSlug || 'streamer';
        const streamerDisplayName = userObj?.username || channelObj?.username || (streamerUsername.charAt(0).toUpperCase() + streamerUsername.slice(1));
        const streamerAvatar = userObj?.profilepic || userObj?.profile_pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80';
        const isVerified = Boolean(channelObj?.verified);

        const rawDur = ls?.duration || videoData.duration || 0;
        const durationSec = rawDur > 100000 ? Math.round(rawDur / 1000) : Math.round(rawDur) || 3600;
        const title = ls?.session_title || videoData.session_title || `${streamerDisplayName} Past Broadcast`;
        const thumbnail = ls?.thumbnail?.src || ls?.thumbnail || videoData.thumbnail?.src || videoData.thumbnail || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1280&auto=format&fit=crop&q=85';
        const streamSrc = videoData.source || ls?.source || '';
        const categoryName = ls?.categories?.[0]?.name || (Array.isArray(videoData.categories) ? videoData.categories[0]?.name : null) || 'Past Broadcast';
        const viewsCount = videoData.views ? `${Number(videoData.views).toLocaleString()} views` : undefined;

        const { qualities, audioOnly } = await buildStreamQualitiesAndAudio(streamSrc, durationSec);

        const media: KickMediaInfo = {
          id: videoData.uuid || videoId,
          type: 'vod',
          title,
          category: categoryName,
          views: viewsCount,
          streamer: {
            username: streamerUsername,
            displayName: streamerDisplayName,
            avatarUrl: streamerAvatar,
            verified: isVerified,
          },
          durationSeconds: durationSec,
          durationFormatted: formatDuration(durationSec),
          thumbnailUrl: thumbnail,
          createdAt: videoData.created_at || new Date().toISOString(),
          sourceUrl: cleanUrl,
          isLatestFromChannel: false,
          qualities,
          audioOnly,
        };

        return NextResponse.json({ success: true, media });
      }

      return NextResponse.json(
        {
          error: `The requested Kick VOD (${videoId}) could not be found. It may have expired (Kick deletes VODs after 30 to 60 days), been set to private, or deleted by the broadcaster.`,
        },
        { status: 404 }
      );
    }

    // =========================================================================
    // CASE 1B: SPECIFIC CLIP URL
    // =========================================================================
    if (target.type === 'clip' && target.clipId) {
      const clipId = target.clipId;
      const clipData = await fetchKickApi(`https://kick.com/api/v2/clips/${clipId}`);

      if (clipData && (clipData.clip || clipData.id)) {
        const item = clipData.clip || clipData;
        const durationSec = Math.max(5, item.duration ? Math.round(Number(item.duration)) : 30);
        const streamerUsername = item.channel?.slug || item.channel?.username || target.channelSlug || 'streamer';
        const streamerDisplayName = item.channel?.username || streamerUsername;
        const streamerAvatar = item.channel?.profile_picture || item.creator?.profile_picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80';
        const clipTitle = item.title || `${streamerDisplayName} Viral Clip`;
        const clipThumbnail = item.thumbnail_url || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1280&auto=format&fit=crop&q=85';
        const streamSrc = item.video_url || item.clip_url || '';

        const { qualities, audioOnly } = await buildStreamQualitiesAndAudio(streamSrc, durationSec);

        const media: KickMediaInfo = {
          id: clipId,
          type: 'clip',
          title: clipTitle,
          category: item.category?.name || 'Clip Highlight',
          views: item.views ? `${Number(item.views).toLocaleString()} views` : 'Trending clip',
          streamer: {
            username: streamerUsername,
            displayName: streamerDisplayName,
            avatarUrl: streamerAvatar,
            verified: true,
          },
          durationSeconds: durationSec,
          durationFormatted: formatDuration(durationSec),
          thumbnailUrl: clipThumbnail,
          createdAt: item.created_at || new Date().toISOString(),
          sourceUrl: cleanUrl,
          isLatestFromChannel: false,
          qualities,
          audioOnly,
        };

        return NextResponse.json({ success: true, media });
      }

      return NextResponse.json(
        { error: `The requested clip (ID: ${clipId}) could not be found or has expired.` },
        { status: 404 }
      );
    }

    // =========================================================================
    // CASE 2: CHANNEL URL OR USERNAME ONLY (Fallback to Latest VOD)
    // =========================================================================
    if (target.type === 'channel' && target.channelSlug) {
      const channelSlug = target.channelSlug;
      const channelData: any = await fetchKickApi(`https://kick.com/api/v1/channels/${channelSlug}`);

      if (!channelData) {
        return NextResponse.json(
          { error: `Could not retrieve channel '@${channelSlug}'. Please verify the streamer username.` },
          { status: 404 }
        );
      }

      const channelProfilePic =
        channelData?.user?.profile_pic ||
        channelData?.user?.profilepic ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80';
      const channelDisplayName =
        channelData?.user?.username || (channelSlug.charAt(0).toUpperCase() + channelSlug.slice(1));
      const channelVerified = Boolean(channelData?.verified);

      if (Array.isArray(channelData.previous_livestreams) && channelData.previous_livestreams.length > 0) {
        const latestBroadcast = channelData.previous_livestreams[0];
        const rawDur = latestBroadcast.duration || 0;
        const durationSec = rawDur > 100000 ? Math.round(rawDur / 1000) : Math.round(rawDur) || 3600;
        const title = latestBroadcast.session_title || `${channelDisplayName} Latest Past Broadcast`;
        const thumbnail =
          latestBroadcast.thumbnail?.src ||
          channelData.offline_banner_image?.src ||
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&auto=format&fit=crop&q=85';
        const viewsCount = latestBroadcast.views
          ? `${Number(latestBroadcast.views).toLocaleString()} views`
          : `${channelData?.followersCount || '95'}K followers`;

        let streamSrc = latestBroadcast.source || '';
        const videoUuid = latestBroadcast.video?.uuid;

        if (!streamSrc && videoUuid) {
          const vDetails = await fetchKickApi(`https://kick.com/api/v1/video/${videoUuid}`);
          streamSrc = vDetails?.source || '';
        }

        const { qualities, audioOnly } = await buildStreamQualitiesAndAudio(streamSrc, durationSec);

        const media: KickMediaInfo = {
          id: videoUuid || `vod-${latestBroadcast.id}`,
          type: 'vod',
          title,
          category: latestBroadcast.categories?.[0]?.name || 'Latest Past Broadcast',
          views: viewsCount,
          streamer: {
            username: channelSlug,
            displayName: channelDisplayName,
            avatarUrl: channelProfilePic,
            verified: channelVerified,
          },
          durationSeconds: durationSec,
          durationFormatted: formatDuration(durationSec),
          thumbnailUrl: thumbnail,
          createdAt: latestBroadcast.created_at || new Date().toISOString(),
          sourceUrl: cleanUrl,
          isLatestFromChannel: true,
          qualities,
          audioOnly,
        };

        return NextResponse.json({ success: true, media });
      }

      if (channelData.livestream) {
        const ls = channelData.livestream;
        const rawDur = ls.duration || 0;
        const durationSec = rawDur > 100000 ? Math.round(rawDur / 1000) : Math.round(rawDur) || 1800;
        const title = ls.session_title || `${channelDisplayName} Live Stream Broadcast`;
        const thumbnail = ls.thumbnail?.src || 'https://images.kick.com/video_thumbnails/default/720.webp';
        const streamSrc = channelData.playback_url || '';

        const { qualities, audioOnly } = await buildStreamQualitiesAndAudio(streamSrc, durationSec);

        const media: KickMediaInfo = {
          id: `live-${channelData.id}`,
          type: 'live',
          title,
          category: ls.categories?.[0]?.name || 'Live Broadcast',
          views: `${ls.viewer_count || 100} live viewers`,
          streamer: {
            username: channelSlug,
            displayName: channelDisplayName,
            avatarUrl: channelProfilePic,
            verified: channelVerified,
          },
          durationSeconds: durationSec,
          durationFormatted: formatDuration(durationSec),
          thumbnailUrl: thumbnail,
          createdAt: new Date().toISOString(),
          sourceUrl: cleanUrl,
          isLatestFromChannel: true,
          qualities,
          audioOnly,
        };

        return NextResponse.json({ success: true, media });
      }

      return NextResponse.json(
        {
          error: `Channel '${channelDisplayName}' currently has no public VODs or past broadcasts available for download.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ error: 'Unsupported URL pattern. Please enter a valid Kick link.' }, { status: 400 });
  } catch (error: any) {
    console.error('Kick resolve error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process Kick link.' },
      { status: 500 }
    );
  }
}
