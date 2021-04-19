import { firestore } from 'firebase-admin'
import { decode } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { userCollection } from '../firebase'

export default function createChatNamespace(
  io: Server<DefaultEventsMap, DefaultEventsMap>
) {
  const chatNSP = io.of('/chat')

  chatNSP.on('connection', async socket => {
    let chat: string
    let user: string

    socket.on('join', ({ room, username }) => {
      if (username && room !== username) {
        user = username
        chatNSP.to(room).emit('message', {
          message: `${username} joined the chat!`,
          type: 'server',
        })
      }
      socket.join(room)
      chat = room
      socket.emit('message', {
        message: 'Welcome to the chat room!',
        type: 'server',
      })
    })

    socket.on('message', async ({ message, user: username, hue }) => {
      if (!message) return
      const { token } = socket.handshake.auth
      if (!token) return

      const payload = decode(socket.handshake.auth.token.replace('Bearer ', ''))

      if (!payload) return

      const res = await userCollection()
        .doc((payload as { [key: string]: any }).username)
        .get()

      if (!res.exists) return

      chatNSP.to(chat).emit('message', {
        message,
        user: username,
        hue,
        type: 'chat',
      })
    })

    socket.on('disconnect', () => {
      if (user) io.to(chat).emit(`${user} left the chat.`)
    })
  })
}
