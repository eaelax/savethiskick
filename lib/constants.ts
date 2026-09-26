import { KickMediaInfo } from '../app/api/kick/resolve/route';

export const INITIAL_MEDIA_PRESET: KickMediaInfo = {
  id: '01a0c52a-dde0-70e3-8784-9685d39d3bf0',
  type: 'vod',
  title: 'Kings League Mena Day 2 - Bakhira FC vs Falcons',
  streamer: {
    username: 'achrafsabiri',
    displayName: 'Achraf Sabiri',
    avatarUrl: 'https://picsum.photos/seed/achraf/120/120',
    verified: true,
  },
  durationSeconds: 4698,
  durationFormatted: '01:18:18',
  thumbnailUrl: 'https://picsum.photos/seed/kingsleague/640/360',
  createdAt: '2026-09-21T18:30:00Z',
  sourceUrl: 'https://kick.com/achrafsabiri/videos/01a0c52a-dde0-70e3-8784-9685d39d3bf0',
  qualities: [
    {
      label: '1080p60 (Source)',
      resolution: '1920x1080',
      fps: 60,
      bandwidth: 8000000,
      estimatedSizeMb: 4698,
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      label: '720p60 (High)',
      resolution: '1280x720',
      fps: 60,
      bandwidth: 4500000,
      estimatedSizeMb: 2640,
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    },
    {
      label: '480p (Medium)',
      resolution: '854x480',
      fps: 30,
      bandwidth: 2000000,
      estimatedSizeMb: 1170,
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      label: '360p (Mobile Saver)',
      resolution: '640x360',
      fps: 30,
      bandwidth: 1000000,
      estimatedSizeMb: 585,
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
  ],
  audioOnly: {
    label: 'Audio Only (MP3 / 320kbps)',
    format: 'mp3',
    bitrate: '320kbps',
    estimatedSizeMb: 188,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
};
