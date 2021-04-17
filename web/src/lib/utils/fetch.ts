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
    ? 'https://devex.jonahgold.dev/stream'
    : 'http://localhost:8000'
}
