export function getSocketURL() {
  return import.meta.env.PROD
    ? 'https://devex.jonahgold.dev'
    : 'http://localhost:5000'
}

export function getApiURL() {
  return import.meta.env.PROD
    ? 'https://devex.jonahgold.dev/api'
    : 'http://localhost:5000/api'
}

export function getStreamURL() {
  return import.meta.env.PROD
    ? 'https://devex.jonahgold.dev'
    : 'http://localhost:8000'
}

export function getRtmpURL() {
  return import.meta.env.PROD
    ? 'rtmp://devex.jonahgold.dev/stream'
    : 'rtmp://localhost:8000/stream'
}
