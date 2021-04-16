function createRandomSecret() {
  let allowed = 'abcdefghijklmnopqrstuvwyz'
  allowed += allowed.toUpperCase() + '0123456789'
  return new Array(24)
    .fill(null)
    .map(_ => allowed[Math.floor(Math.random() * allowed.length)])
    .join('')
}

export const secret = createRandomSecret()
