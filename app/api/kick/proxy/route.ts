import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
  }

  const rangeHeader = req.headers.get('range');

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Referer: 'https://kick.com/',
        Origin: 'https://kick.com',
        ...(rangeHeader ? { Range: rangeHeader } : {}),
      },
      signal: req.signal,
    });

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Range, Content-Type');
    headers.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');

    const contentType = upstreamRes.headers.get('content-type');
    const contentLength = upstreamRes.headers.get('content-length');
    const contentRange = upstreamRes.headers.get('content-range');
    const acceptRanges = upstreamRes.headers.get('accept-ranges');

    if (contentType) headers.set('Content-Type', contentType);
    if (contentLength) headers.set('Content-Length', contentLength);
    if (contentRange) headers.set('Content-Range', contentRange);
    if (acceptRanges) headers.set('Accept-Ranges', acceptRanges);

    headers.set('Cache-Control', 'public, max-age=86400');

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      headers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Proxy request failed: ' + error.message },
      { status: 502 }
    );
  }
}
