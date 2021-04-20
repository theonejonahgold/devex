import { Server } from 'socket.io'
import { languagesCollection, userCollection } from '../firebase'

const watches = new Map<string, () => void>()

export default function createWatchNamespace(io: Server) {
  const watchNSP = io.of('/watch')

  watchNSP.on('connection', socket => {
    let watching: string

    socket.on('watch', async ({ channel }) => {
      socket.join(channel)
      watching = channel

      userCollection()
        .doc(watching)
        .update({ viewers: watchNSP.adapter.rooms.get(watching)?.size || 0 })
        .catch(console.error)

      if (
        watchNSP.adapter.rooms.get(watching) &&
        watchNSP.adapter.rooms.get(watching)!.size > 1
      )
        return

      const stop = userCollection()
        .doc(channel)
        .onSnapshot(async snap => {
          const user = snap.data()!
          if (user.language)
            if (user.language)
              user.language = (
                await languagesCollection()
                  .where('slug', '==', user.language)
                  .get()
              ).docs[0].data().name
          watchNSP.to(channel).emit('update', {
            viewers: user.viewers,
            live: user.live,
            streamTitle: user.streamTitle,
            username: user.username,
            language: user.language,
          })
        })
      watches.set(channel, stop)
    })

    socket.on('disconnect', () => {
      if (!watching) return
      userCollection()
        .doc(watching)
        .update({ viewers: watchNSP.adapter.rooms.get(watching)?.size || 0 })
        .catch(console.error)
      if (watchNSP.adapter.rooms.get(watching)?.size) return
      watches.get(watching)?.()
      watches.delete(watching)
    })
  })
}
