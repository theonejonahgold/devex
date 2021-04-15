import Koa from 'koa'
import session from 'koa-session'
import passport from 'koa-passport'
import './passport'
import bodyParser from 'koa-bodyparser'
import http from 'http'
import router from './router'
import cors from '@koa/cors'
import { secret } from './utils'

main()

function main() {
  const app = new Koa()
  app.keys = [secret]
  app.use(cors({ origin: '*' }))
  app.use(session(app))
  app.use(bodyParser())
  app.use(passport.initialize())
  app.use(router.routes())
  http.createServer(app.callback()).listen(process.env.PORT || 5000)
}
