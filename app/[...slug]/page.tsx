import React from 'react';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { normalizeKickUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const rawPath = slug.join('/');
  const baseUrl = process.env.APP_URL || 'https://savethiskick.com';

  // Tool specific high-converting metadata mapping
  const toolSlug = slug.length > 1 && slug[0] === 'tools' ? slug[1] : '';
  const isTool = slug[0] === 'tools';

  let title = 'Download Kick VODs, Clips & Full Broadcasts in .MPG & .MP3 | SaveThisKick';
  let description =
    'Fast and free online tool to download Kick VODs, past broadcasts, and viral clips in original 1080p60 .mpg format or high-fidelity .mp3 audio.';
  let keywords = [
    'Kick Downloader',
    'Kick VOD Downloader',
    'Kick Clips Downloader',
    'Kick to MP3',
    'SaveThisKick',
  ];

  if (isTool) {
    if (toolSlug === 'kick-vod-downloader') {
      title = 'Kick VOD Downloader – Download Full Kick Streams (.MPG / .MP3) | SaveThisKick';
      description =
        'Download full Kick VODs and past broadcasts in 1080p60 source quality. No buffering, zero RAM lag, native desktop video player support.';
      keywords.push('download kick vods', 'save full kick broadcast', 'kick vod 1080p');
    } else if (toolSlug === 'kick-clips-downloader') {
      title = 'Kick Clips Downloader – Save HD Kick Clips Online Free | SaveThisKick';
      description =
        'Extract and download viral Kick clips instantly in full HD 1080p. Perfect for content creators creating TikTok and YouTube highlight shorts.';
      keywords.push('kick clips download', 'save kick highlights', 'kick clip to mp4');
    } else if (toolSlug === 'kick-audio-mp3-extractor') {
      title = 'Kick to MP3 – Extract Audio from Kick Streams Online | SaveThisKick';
      description =
        'Convert any Kick livestream, podcast, or VOD to 320kbps MP3 audio. Fast client-side audio extraction with zero video data wasted.';
      keywords.push('kick to mp3', 'kick audio extractor', 'kick stream to audio');
    } else if (toolSlug === 'kick-to-mpg-1080p') {
      title = 'Kick to .MPG 1080p – Playable Video Stream Downloader | SaveThisKick';
      description =
        'Transcode and save Kick streams directly into universally playable .mpg desktop containers compatible with Windows Media Player and QuickTime.';
      keywords.push('kick to mpg', 'kick 1080p video', 'stream to mpg container');
    } else {
      const cleanToolName = toolSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      title = `${cleanToolName} – High-Speed Kick Media Tool | SaveThisKick`;
      description = `Use SaveThisKick's ${cleanToolName} utility to process, archive, and download Kick.com broadcasts and clips online.`;
    }
  } else {
    // Streamer pSEO extraction
    let streamerName = 'Kick';
    if (slug.length > 0) {
      const lastPart = slug[slug.length - 1].replace(/-vod$|-clips$|^download-/, '');
      if (lastPart) {
        streamerName = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
      }
    }

    if (streamerName !== 'Kick') {
      title = `Download ${streamerName} Kick VODs, Replays & Clips (.MPG / .MP3) | SaveThisKick`;
      description = `Free high-speed Kick downloader for @${streamerName}. Download full VOD broadcasts in 1080p60 .mpg format or extract crystal-clear .mp3 audio on any device.`;
      keywords.push(
        `download ${streamerName} kick vod`,
        `${streamerName} kick replays`,
        `${streamerName} kick stream download`,
        `save ${streamerName} past broadcasts`
      );
    }
  }

  const canonicalUrl = `/${rawPath}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'SaveThisKick',
      images: [
        {
          url: `${baseUrl}/icon.svg`,
          width: 512,
          height: 512,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
      images: [`${baseUrl}/icon.svg`],
    },
  };
}

export default async function CatchAllPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const slug = resolvedParams.slug || [];
  let reconstructedUrl = '';

  if (slug.length > 0) {
    const rawPath = slug.join('/');
    reconstructedUrl = normalizeKickUrl(rawPath);

    // Append any clip query parameter if present
    if (resolvedSearch.clip) {
      const clipVal = Array.isArray(resolvedSearch.clip) ? resolvedSearch.clip[0] : resolvedSearch.clip;
      reconstructedUrl += (reconstructedUrl.includes('?') ? '&' : '?') + `clip=${clipVal}`;
    }
  }

  const baseUrl = process.env.APP_URL || 'https://savethiskick.com';
  const pagePath = slug.join('/');

  // Dynamic pSEO Breadcrumb and WebPage Schema
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: slug[0] ? slug[0].toUpperCase() : 'Downloader',
        item: `${baseUrl}/${slug[0] || ''}`,
      },
      ...(slug.length > 1
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: slug[1],
              item: `${baseUrl}/${pagePath}`,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <HomeClient initialUrl={reconstructedUrl} />
    </>
  );
}
