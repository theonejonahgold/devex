import { decode } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { userCollection } from '../firebase'

const watchMap = new Map<string, () => void>()

export default function createFollowingNamespace(io: Server) {
  const followingNSP = io.of('/following')

  followingNSP.use(async (socket, next) => {
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

  followingNSP.on('connection', async socket => {
    socket.data.user.following.forEach((user: string) => {
      socket.join(user)
      if (watchMap.has(user)) return
      watchMap.set(
        user,
        userCollection()
          .doc(user)
          .onSnapshot(snap => {
            const data = snap.data()!
            const filteredUser = {
              username: data.username,
              viewers: data.viewers,
              live: data.live,
              streamTitle: data.streamTitle,
            }
            followingNSP.to(user).emit('update', filteredUser)
          })
      )

      socket.on('update', (following: string[]) => {
        following.filter(user => !socket.rooms.has(user)).forEach(socket.join)
        socket.rooms.forEach(async room => {
          if (room !== socket.id && !following.includes(room))
            await socket.leave(room)
        })

        following
          .filter(user => !watchMap.has(user))
          .forEach(user => {
            watchMap.set(
              user,
              userCollection()
                .doc(user)
                .onSnapshot(snap => {
                  const data = snap.data()!
                  const filteredUser = {
                    username: data.username,
                    viewers: data.viewers,
                    live: data.live,
                    streamTitle: data.streamTitle,
                  }
                  followingNSP.to(user).emit('update', filteredUser)
                })
            )
          })
      })

      socket.on('disconnect', () => {
        socket.data.user.following.forEach((user: string) => {
          if (
            followingNSP.adapter.rooms.get(user) &&
            followingNSP.adapter.rooms.get(user)!.size > 0
          )
            return
          watchMap.get(user)?.()
          watchMap.delete(user)
        })
      })
    })

    const initalData = (
      await userCollection()
        .select('username', 'viewers', 'live', 'streamTitle')
        .where('username', 'in', socket.data.user.following)
        .get()
    ).docs.map(doc => doc.data())

    socket.emit('initial-data', initalData)
  })
}
