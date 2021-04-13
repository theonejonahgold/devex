import mkdirp from 'mkdirp'
import fs from 'fs'
import { resolve } from 'path'

function template(name: string) {
  let line = `#EXTM3U\n#EXT-X-VERSION:3\n`
  line += `#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\n./../hls_360p/${name}/index.m3u8\n`
  line += `#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480\n./../hls_480p/${name}/index.m3u8\n`
  line += `#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\n./../hls_720p/${name}/index.m3u8\n`
  line += `#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080\n./../hls_1080p/${name}/index.m3u8`
  return line
}

export default async function createPlaylist(name: string) {
  const livePath = resolve(
    process.env.MEDIA_ROOT || resolve(__dirname, '..', 'media'),
    'live'
  )
  await mkdirp(livePath)
  const playlist = resolve(livePath, `${name}.m3u8`)
  fs.open(playlist, 'w', (err, fd) => {
    if (err) throw err
    fs.writeFile(fd, template(name), errWrite => {
      if (errWrite) throw errWrite
      fs.close(fd, err => {
        if (err) throw err
      })
    })
  })
}
