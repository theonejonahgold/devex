import cors from '@koa/cors'
import { createServer } from 'http'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import passport from 'koa-passport'
import { Server } from 'socket.io'
import router from './router'
import { secret } from './utils'

import './passport'
import createChatNamespace from './socket/chat'
import createWatchNamespace from './socket/watch'
import createMeNamespace from './socket/me'
import createFollowingNamespace from './socket/following'

main()

function main() {
  const app = new Koa()
  app.keys = [secret]
  app.use(cors({ origin: '*' }))
  app.use(bodyParser())
  app.use(passport.initialize())
  app.use(router.routes())
  const httpServer = createServer(app.callback())
  const io = new Server(httpServer, {
    cors: { origin: '*' },
    path: '/api/socket.io/',
  })
  httpServer.listen(process.env.PORT || 5000)

  createChatNamespace(io)
  createWatchNamespace(io)
  createFollowingNamespace(io)
  createMeNamespace(io)
}
