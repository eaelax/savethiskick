import type { Metadata } from 'next';
import { Rubik, Almarai } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
});

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SaveThisKick – Kick Downloader | Download Kick VODs, Clips & Audio (.MPG / .MP3)',
  description:
    'Free high-speed Kick downloader. Download Kick VODs, clips, and replays in 1080p60 (.mpg) or extract audio (.mp3). No buffering, no watermark, fast and safe.',
  keywords: [
    'Kick Downloader',
    'Kick VOD Downloader',
    'Kick Clip Downloader',
    'Kick to MP3',
    'Kick Video Downloader',
    'how to download kick past broadcasts',
    'download kick streams without buffering',
    'save kick vod 1080p 60fps free',
    'extract audio from kick stream online',
    'download full kick replay to mpg',
    'SaveThisKick',
    'savethiskick',
  ],
  authors: [{ name: 'SaveThisKick' }],
  metadataBase: new URL(process.env.APP_URL || 'https://savethiskick.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    title: 'SaveThisKick – Kick Downloader | VODs, Clips & MP3',
    description:
      'Fast online tool to download Kick VODs and clips in .mpg or .mp3. Zero lag, high speed, and instant address bar prefix.',
    type: 'website',
    url: '/',
    siteName: 'SaveThisKick',
    locale: 'en_US',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'SaveThisKick Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaveThisKick – Kick Downloader (.MPG & .MP3)',
    description:
      'Save Kick streams, VODs, and clips in original quality (.mpg) or extract audio (.mp3) without buffering.',
    images: ['/icon.svg'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  other: {
    'google-adsense-account': 'ca-pub-0000000000000000',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = process.env.APP_URL || 'https://savethiskick.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'SaveThisKick',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/streamer/{search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'SaveThisKick - Kick Downloader',
        url: baseUrl,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All (Windows, macOS, Linux, iOS, Android)',
        browserRequirements: 'Requires modern web browser',
        description:
          'High-speed Kick downloader software utility for saving Kick VODs, full stream replays in .mpg format, and extracting crystal-clear .mp3 audio tracks.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Full video downloads in .mpg/.mp4 format with high-speed multi-threaded chunks',
          'Only audio extraction in high-bitrate .mp3 format',
          'Fast URL navigation: savethiskick.com or savethis prefix',
          '100% anonymous processing with zero user tracking',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Will downloaded Kick VODs play properly on Windows Media Player and QuickTime?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! SaveThisKick structures the video stream container to ensure 100% native compatibility with desktop media players including Windows Media Player, Movies & TV, QuickTime, and VLC without needing extra codecs.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I download a Kick stream by editing the URL?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Simply type "savethis" directly before "kick.com" in your browser address bar while on any Kick stream or VOD (e.g. savethiskick.com/streamer) or visit https://www.savethiskick.com/ and press Enter to instantly analyze and download.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I extract only the audio as an MP3 file?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Select the MP3 format option to download high-fidelity 320kbps stereo audio without downloading the heavy video chunks.',
            },
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Download Kick VODs and Clips with SaveThisKick',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Method 1: Copy and Paste URL',
            text: 'Copy any Kick VOD or clip URL from kick.com, paste it into the search bar on SaveThisKick.com, and click Download.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Method 2: Address Bar Shortcut',
            text: 'Add "savethis" directly before "kick.com" in your browser address bar while watching any stream or clip, and press Enter.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Select Quality and Save',
            text: 'Choose your desired resolution (1080p60 Source, 720p, or MP3 audio) and download the file directly.',
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('kick_theme');
                  if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                  var savedLang = localStorage.getItem('kick_lang');
                  if (savedLang === 'ar') {
                    document.documentElement.lang = 'ar';
                    document.documentElement.dir = 'rtl';
                  } else if (savedLang) {
                    document.documentElement.lang = savedLang === 'ch' ? 'zh' : savedLang;
                    document.documentElement.dir = 'ltr';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${rubik.variable} ${almarai.variable} antialiased min-h-screen`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
