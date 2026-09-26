import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
  }

  const rangeHeader = req.headers.get('range');

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Referer': 'https://kick.com/',
      'Origin': 'https://kick.com',
    };

    if (rangeHeader) {
      headers['Range'] = rangeHeader;
    }

    const upstreamRes = await fetch(targetUrl, {
      headers,
      signal: req.signal,
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      return NextResponse.json(
        { error: `Upstream error ${upstreamRes.status}` },
        { status: upstreamRes.status }
      );
    }

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

    const upstreamContentType = upstreamRes.headers.get('content-type');
    if (upstreamContentType) {
      responseHeaders.set('Content-Type', upstreamContentType);
    }

    const upstreamContentLength = upstreamRes.headers.get('content-length');
    if (upstreamContentLength) {
      responseHeaders.set('Content-Length', upstreamContentLength);
    }

    const upstreamContentRange = upstreamRes.headers.get('content-range');
    if (upstreamContentRange) {
      responseHeaders.set('Content-Range', upstreamContentRange);
    }

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return new NextResponse(null, { status: 499 });
    }
    return NextResponse.json({ error: 'Proxy request failed: ' + error.message }, { status: 500 });
  }
}
