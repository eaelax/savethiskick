import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://savethiskick.com';
  const currentDate = new Date().toISOString();

  // Core Legal & Compliance Pages
  const corePages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/dmca', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  // High-Intent Tool & Conversion Landing Pages
  const toolPages = [
    { path: '/tools/kick-vod-downloader', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/tools/kick-clips-downloader', priority: 0.95, changeFrequency: 'daily' as const },
    { path: '/tools/kick-audio-mp3-extractor', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/tools/kick-to-mpg-1080p', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/tools/download-kick-stream-without-buffering', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/kick-past-broadcasts-saver', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/kick-livestream-recorder-online', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/kick-m3u8-downloader', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/kick-vod-to-mp4-converter', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/download-kick-vod-iphone-ios', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/download-kick-vod-android', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/download-kick-vod-mac-pc', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/tools/kick-vod-audio-extractor-320kbps', priority: 0.85, changeFrequency: 'weekly' as const },
  ];

  // Top 60+ Most Searched Kick Broadcasters (pSEO Search Matrix)
  const topStreamers = [
    'xqc',
    'adinross',
    'westcol',
    'trainwreckstv',
    'hikaru',
    'roshtein',
    'n3on',
    'amouranth',
    'therealpatty',
    'ac7ionman',
    'fousey',
    'vitaly',
    'mellstroy',
    'brucedropemoff',
    'yourrage',
    'sapnap',
    'destiny',
    'drdisrespect',
    'plaqueboymax',
    'silky',
    'corinnakopf',
    'tuecke',
    'samfrank',
    'iziprime',
    'slikerdog',
    'moistcr1tikal',
    'suspendas',
    'brutalsmiles',
    'connor',
    'captainjack',
    'bigboss',
    'sypherpk',
    'clix',
    'pokimane',
    'heisenwolf',
    'drayn',
    'rubius',
    'auronplay',
    'ibai',
    'juansguarnizo',
    'rivers_gg',
    'elded',
    'spreen',
    'elxokas',
    'davoooxeneize',
    'coscu',
    'litkillah',
    'misterjagger',
    'robleisi',
    'sliker',
    'macaiyla',
    'superkf1',
    'rebound',
    'skeptical',
    'swagg',
    'scump',
    'timthetatman',
    'myth',
    'zoil',
    'hasanabi',
  ];

  const streamerRoutes = topStreamers.flatMap((streamer) => [
    { path: `/download/${streamer}-vod`, priority: 0.85, changeFrequency: 'daily' as const },
    { path: `/streamer/${streamer}`, priority: 0.85, changeFrequency: 'daily' as const },
    { path: `/download/${streamer}-clips`, priority: 0.8, changeFrequency: 'weekly' as const },
  ]);

  const allRoutes = [...corePages, ...toolPages, ...streamerRoutes];

  return allRoutes.map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: currentDate,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
