import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { sanitizeFilename } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const streamUrl = searchParams.get('url');
  const rawFilename = searchParams.get('filename') || 'kick_video.mpg';
  const format = (searchParams.get('format') || 'mpg').toLowerCase();
  const mediaType = (searchParams.get('type') || '').toLowerCase();
  const startTime = searchParams.get('startTime') ? parseFloat(searchParams.get('startTime')!) : undefined;
  const endTime = searchParams.get('endTime') ? parseFloat(searchParams.get('endTime')!) : undefined;

  if (!streamUrl) {
    return NextResponse.json({ error: 'Missing stream URL' }, { status: 400 });
  }

  // Optimize direct clips if requested format matches native mp4
  const isHlsStream = streamUrl.includes('.m3u8');
  const isDirectClip = mediaType === 'clip' || (!isHlsStream && (streamUrl.includes('.mp4') || streamUrl.includes('clips.kick.com')));

  if (isDirectClip && !isHlsStream && format === 'mp4') {
    return NextResponse.redirect(streamUrl, 302);
  }

  // Sanitize download filename strictly with mpg or mp3
  const effectiveFormat = format === 'mp3' ? 'mp3' : 'mpg';
  const safeFilename = sanitizeFilename(rawFilename, effectiveFormat);
  const contentType = effectiveFormat === 'mp3' ? 'audio/mpeg' : 'video/mpeg';

  // Construct FFmpeg arguments for Zero-Disk Stream Piping
  // Headers required to bypass Cloudflare/AWS 403 Forbidden on stream.kick.com and clips.kick.com
  const httpHeaders = 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36\r\nReferer: https://kick.com/\r\nOrigin: https://kick.com\r\n';

  const ffmpegArgs: string[] = [
    '-headers', httpHeaders,
    '-reconnect', '1',
    '-reconnect_streamed', '1',
    '-reconnect_delay_max', '5',
  ];

  // Optional start time seeking
  if (typeof startTime === 'number' && startTime > 0) {
    ffmpegArgs.push('-ss', startTime.toString());
  }

  // Input source URL
  ffmpegArgs.push('-i', streamUrl);

  // Optional end time / duration limit
  if (typeof endTime === 'number' && endTime > (startTime || 0)) {
    const duration = endTime - (startTime || 0);
    ffmpegArgs.push('-t', duration.toString());
  }

  // Output format & audio/video encoding configuration:
  // Zero-Disk Stream Piping:
  // Use stream copy (-c copy) so CPU usage remains near zero.
  // Fragmented MP4 flags (-movflags frag_keyframe+empty_moov -f mp4 pipe:1).
  // -bsf:a aac_adtstoasc is critical for transmuxing HLS ADTS AAC into MP4 without bitstream errors.
  if (format === 'mp3') {
    ffmpegArgs.push(
      '-vn',
      '-c:a', 'libmp3lame',
      '-q:a', '2',
      '-f', 'mp3',
      'pipe:1'
    );
  } else if (format === 'mp4') {
    // Standard MP4
    ffmpegArgs.push(
      '-c', 'copy',
      '-bsf:a', 'aac_adtstoasc',
      '-movflags', 'frag_keyframe+empty_moov',
      '-f', 'mp4',
      'pipe:1'
    );
  } else {
    // Native MPEG stream for 100% desktop player compatibility (.mpg)
    ffmpegArgs.push(
      '-c', 'copy',
      '-f', 'mpegts',
      'pipe:1'
    );
  }

  // Spawn FFmpeg child process
  let ffmpegProcess: ReturnType<typeof spawn>;
  try {
    ffmpegProcess = spawn('ffmpeg', ffmpegArgs, {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (spawnError: any) {
    console.error('Failed to spawn ffmpeg:', spawnError);
    return NextResponse.json(
      { error: 'FFmpeg binary not available on host: ' + spawnError.message },
      { status: 500 }
    );
  }

  // Collect stderr in case of immediate failure
  let stderrBuffer = '';
  ffmpegProcess.stderr?.on('data', (data) => {
    const text = data.toString();
    stderrBuffer = (stderrBuffer + text).slice(-2000);
  });

  // Ensure child processes are killed properly if the client disconnects mid-stream
  const killProcess = () => {
    if (ffmpegProcess && !ffmpegProcess.killed) {
      try {
        ffmpegProcess.kill('SIGKILL');
      } catch {}
    }
  };

  req.signal.addEventListener('abort', () => {
    killProcess();
  });

  // Create Web ReadableStream piping ffmpeg stdout directly to the HTTP response
  const stream = new ReadableStream({
    start(controller) {
      ffmpegProcess.stdout?.on('data', (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk));
      });

      ffmpegProcess.stdout?.on('end', () => {
        try {
          controller.close();
        } catch {}
      });

      ffmpegProcess.stdout?.on('error', (err) => {
        console.error('FFmpeg stdout stream error:', err);
        try {
          controller.error(err);
        } catch {}
        killProcess();
      });

      ffmpegProcess.on('error', (err) => {
        console.error('FFmpeg process error:', err);
        try {
          controller.error(err);
        } catch {}
        killProcess();
      });

      ffmpegProcess.on('exit', (code) => {
        if (code !== 0 && code !== null && code !== 255) {
          console.warn(`FFmpeg exited with code ${code}:`, stderrBuffer.slice(-500));
        }
      });
    },
    cancel() {
      killProcess();
    },
  });

  // Set response headers forcing native browser download
  const headers = new Headers();
  headers.set('Content-Type', contentType);
  headers.set('Content-Disposition', `attachment; filename="${safeFilename}"`);
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.set('X-Content-Type-Options', 'nosniff');

  return new NextResponse(stream, {
    status: 200,
    headers,
  });
}
