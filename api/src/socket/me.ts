import { decode } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { userCollection } from '../firebase'

export default function createMeNamespace(io: Server) {
  const meNSP = io.of('/me')
  meNSP.use(async (socket, next) => {
    const { token } = socket.handshake.auth
    if (!token) return next(new Error('No token provided'))

    const payload = decode(socket.handshake.auth.token.replace('Bearer ', ''))

    if (!payload) return next(new Error('Token invalid'))

    const res = await userCollection()
      .doc((payload as { [key: string]: any }).username)
      .get()

    if (!res.exists) return next(new Error("User doesn't exist"))

    socket.data.user = res.data()
    return next()
  })
  meNSP.on('connection', socket => {
    const stop = userCollection()
      .doc(socket.data.user.username)
      .onSnapshot(snap => {
        console.log('hoi')
        const user = snap.data()!
        const filteredUser = {
          username: user.username,
          viewers: user.viewers,
          following: user.following,
          streamKey: user.streamKey,
          live: user.live,
          streamTitle: user.streamTitle,
        }
        socket.emit('update', filteredUser)
      })
    socket.on('disconnect', stop)
  })
}
