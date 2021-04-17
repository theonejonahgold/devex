import { Server } from 'socket.io'
import { userCollection } from '../firebase'

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
        .onSnapshot(snap => {
          const data = snap.data()
          watchNSP.to(channel).emit('update', {
            viewers: data?.viewers,
            live: data?.live,
            streamTitle: data?.streamTitle,
            username: data?.username,
          })
        })
      watches.set(channel, stop)
    })

    socket.on('disconnect', () => {
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
