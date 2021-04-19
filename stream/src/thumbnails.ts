import { ChildProcess, spawn } from 'child_process'
import { readdirSync } from 'fs'
import mkdirp from 'mkdirp'
import { resolve } from 'path'

export default async function thumbnails() {
  const ffmpegPath = process.env.FFMPEG_PATH!
  const mediaPath = process.env.MEDIA_ROOT || resolve(__dirname, '..', 'media')
  const streamPath = resolve(mediaPath, 'live')
  const thumbnailPath = resolve(mediaPath, 'thumbnails')
  await mkdirp(thumbnailPath)
  const streams = readdirSync(streamPath)
  try {
    await Promise.all(
      streams.map(stream =>
        // command from: https://stackoverflow.com/questions/53854681/ffmpeg-create-thumbnail-from-hls-live-stream
        childPromise(
          spawn(ffmpegPath, [
            '-y',
            '-i',
            resolve(streamPath, stream),
            '-s',
            '1280x720',
            '-vframes',
            '1',
            '-f',
            'image2',
            '-update',
            '1',
            `${resolve(thumbnailPath, stream.replace('.m3u8', ''))}.jpg`,
          ])
        )
      )
    )
  } catch (err) {
    console.error(err)
  }
}

function childPromise(child: ChildProcess) {
  return new Promise((resolve, reject) => {
    child.addListener('error', reject)
    child.addListener('exit', resolve)
  })
}
