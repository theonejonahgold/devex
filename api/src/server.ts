import Koa from 'koa'
import session from 'koa-session'
import passport from 'koa-passport'
import './passport'
import bodyParser from 'koa-bodyparser'
import http from 'http'
import router from './router'
import cors from '@koa/cors'

main()

function main() {
  const app = new Koa()
  app.keys = [createRandomSecret()]
  app.use(
    cors({
      origin: '*',
    })
  )
  app.use(session(app))
  app.use(bodyParser())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(router.routes())
  http.createServer(app.callback()).listen(process.env.PORT || 5000)
}

function createRandomSecret() {
  let allowed = 'abcdefghijklmnopqrstuvwyz'
  allowed += allowed.toUpperCase() + '0123456789'
  return new Array(24)
    .fill(null)
    .map(_ => allowed[Math.floor(Math.random() * allowed.length)])
    .join('')
}
