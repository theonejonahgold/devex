import cors from '@koa/cors'
import { firestore } from 'firebase-admin'
import { createServer } from 'http'
import { decode } from 'jsonwebtoken'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import passport from 'koa-passport'
import session from 'koa-session'
import { Server } from 'socket.io'
import { userCollection } from './firebase'
import './passport'
import router from './router'
import { errorBody } from './router/utils'
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
  const httpServer = createServer(app.callback())
  const io = new Server(httpServer, {
    cors: { origin: '*' },
    path: '/chat/',
  })
  httpServer.listen(process.env.PORT || 5000)

  io.use(async (socket, next) => {
    const { token } = socket.handshake.auth
    if (!token) {
      socket.emit('connect_error', errorBody('No token provided'))
      return socket.disconnect()
    }
    const payload = decode(socket.handshake.auth.token.replace('Bearer ', ''))

    if (!payload) return next(new Error('Invalid token'))

    const res = await userCollection()
      .doc((payload as { [key: string]: any }).username)
      .get()

    if (!res.exists) return next(new Error("User doesn't exist"))
    next()
  })

  io.on('connection', async socket => {
    socket.on('join', ({ room }) => {
      socket.join(room)
      socket.emit('joined', { room })
      userCollection()
        .doc(room)
        .update({ viewers: firestore.FieldValue.increment(1) })
        .catch(console.error)
    })

    socket.on('message', ({ message, user: username }) => {
      if (!message) return

      socket.rooms.forEach(room => {
        if (socket.id !== room) {
          io.to(room).emit('message', { message, user: username })
        }
      })
    })

    socket.on('disconnect', () => {
      socket.rooms.forEach(room => {
        if (socket.id !== room) {
          userCollection()
            .doc(room)
            .update({
              viewers: firestore.FieldValue.increment(-1),
            })
            .catch(console.error)
        }
      })
    })
  })
}
