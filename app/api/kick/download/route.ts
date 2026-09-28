import { NextRequest, NextResponse } from 'next/server';
import { sanitizeFilename } from '@/lib/utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const COMMON_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  Referer: 'https://kick.com/',
  Origin: 'https://kick.com',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const streamUrl = searchParams.get('url');
    const rawFilename = searchParams.get('filename') || 'kick_audio';
    const format = (searchParams.get('format') || 'mp3').toLowerCase();
    const isAudioParam = searchParams.get('audio') === 'true' || format === 'mp3' || format === 'm4a' || format === 'audio';

    if (!streamUrl) {
      return NextResponse.json({ error: 'Missing stream URL parameter.' }, { status: 400 });
    }

    let effectiveExt = 'mp3';
    let contentType = 'audio/mpeg';

    if (isAudioParam) {
      if (format === 'm4a') {
        effectiveExt = 'm4a';
        contentType = 'audio/mp4';
      } else {
        effectiveExt = 'mp3';
        contentType = 'audio/mpeg';
      }
    } else {
      if (format === 'mpg') {
        effectiveExt = 'mpg';
        contentType = 'video/mpeg';
      } else {
        effectiveExt = 'mp4';
        contentType = 'video/mp4';
      }
    }

    const safeFilename = sanitizeFilename(rawFilename, effectiveExt);

    // Case 1: Kick HLS Stream (.m3u8 playlist)
    if (streamUrl.includes('.m3u8')) {
      const playlistRes = await fetch(streamUrl, {
        headers: COMMON_HEADERS,
        signal: req.signal,
      });

      if (!playlistRes.ok) {
        return NextResponse.json(
          { error: `Failed to fetch Kick stream manifest (HTTP ${playlistRes.status})` },
          { status: 502 }
        );
      }

      const playlistText = await playlistRes.text();
      let targetVariantUrl = streamUrl;

      if (playlistText.includes('#EXT-X-STREAM-INF:') || playlistText.includes('#EXT-X-MEDIA:TYPE=AUDIO')) {
        const lines = playlistText.split('\n');
        let selectedPath = '';
        let minBandwidth = Infinity;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.includes('TYPE=AUDIO') && line.includes('URI=')) {
            const uriMatch = line.match(/URI="([^"]+)"/);
            if (uriMatch && uriMatch[1]) {
              selectedPath = uriMatch[1];
              break;
            }
          }
          if (line.startsWith('#EXT-X-STREAM-INF:')) {
            const bwMatch = line.match(/BANDWIDTH=([0-9]+)/);
            const bw = bwMatch ? parseInt(bwMatch[1], 10) : 1000000;
            const nextLine = lines[i + 1]?.trim();
            if (nextLine && !nextLine.startsWith('#') && bw < minBandwidth) {
              minBandwidth = bw;
              selectedPath = nextLine;
            }
          }
        }

        if (selectedPath) {
          targetVariantUrl = selectedPath.startsWith('http')
            ? selectedPath
            : new URL(selectedPath, streamUrl).href;
        }
      }

      let variantText = playlistText;
      if (targetVariantUrl !== streamUrl) {
        const varRes = await fetch(targetVariantUrl, {
          headers: COMMON_HEADERS,
          signal: req.signal,
        });
        if (varRes.ok) {
          variantText = await varRes.text();
        }
      }

      const varLines = variantText.split('\n');
      const segmentUrls: string[] = [];
      for (const line of varLines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const fullSegUrl = trimmed.startsWith('http')
            ? trimmed
            : new URL(trimmed, targetVariantUrl).href;
          segmentUrls.push(fullSegUrl);
        }
      }

      if (segmentUrls.length === 0) {
        return NextResponse.redirect(streamUrl, 302);
      }

      const responseStream = new ReadableStream({
        async start(controller) {
          try {
            for (const segUrl of segmentUrls) {
              if (req.signal.aborted) break;

              const segRes = await fetch(segUrl, {
                headers: COMMON_HEADERS,
                signal: req.signal,
              });

              if (segRes.ok && segRes.body) {
                const reader = segRes.body.getReader();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  if (value) {
                    controller.enqueue(value);
                  }
                }
              }
            }
          } catch {
            // Client canceled or stream ended
          } finally {
            try {
              controller.close();
            } catch {}
          }
        },
      });

      return new NextResponse(responseStream, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${safeFilename}"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Case 2: Direct media file (e.g. Kick viral clip .mp4)
    const upstreamRes = await fetch(streamUrl, {
      headers: COMMON_HEADERS,
      signal: req.signal,
    });

    if (!upstreamRes.ok) {
      return NextResponse.redirect(streamUrl, 302);
    }

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('Access-Control-Allow-Origin', '*');

    const upstreamLength = upstreamRes.headers.get('content-length');
    if (upstreamLength) {
      headers.set('Content-Length', upstreamLength);
    }

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Kick audio/video download error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process audio/video stream download.' },
      { status: 500 }
    );
  }
}
