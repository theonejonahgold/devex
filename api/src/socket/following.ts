import { decode } from 'jsonwebtoken'
import { Server } from 'socket.io'
import { languagesCollection, userCollection } from '../firebase'

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
          .onSnapshot(async snap => {
            const data = snap.data()!
            if (data.language)
              data.language = (
                await languagesCollection()
                  .where('slug', '==', data.language)
                  .get()
              ).docs[0].data().name
            const filteredUser = {
              username: data.username,
              viewers: data.viewers,
              live: data.live,
              streamTitle: data.streamTitle,
              language: data.language,
            }
            followingNSP.to(user).emit('update', filteredUser)
          })
      )

      socket.on('update', (following: string[]) => {
        following
          .filter(user => !socket.rooms.has(user))
          .forEach(user => socket.join(user))
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
          if (!followingNSP.adapter.rooms.get(user)?.size) {
            watchMap.get(user)?.()
            watchMap.delete(user)
          }
        })
      })
    })

    const initialUsers = (
      await userCollection()
        .select('username', 'viewers', 'live', 'streamTitle')
        .where('username', 'in', socket.data.user.following)
        .get()
    ).docs.map(doc => doc.data())

    const initialData = await Promise.all(
      initialUsers.map(async data => {
        if (data.language)
          data.language = (
            await languagesCollection().where('slug', '==', data.language).get()
          ).docs[0].data().name
        return {
          username: data.username,
          viewers: data.viewers,
          live: data.live,
          streamTitle: data.streamTitle,
          language: data.language,
        }
      })
    )

    socket.emit('initial-data', initialData)
  })
}
