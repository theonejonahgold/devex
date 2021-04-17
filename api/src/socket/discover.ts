import { Server } from 'socket.io'
import { userCollection } from '../firebase'
import { DBUser } from 'types/user'

export default function createDiscoverNamespace(io: Server) {
  const discoverNSP = io.of('/discover')
  let stop: (() => void) | undefined
  discoverNSP.on('connection', socket => {
    socket.on('disconnect', () => {
      if (!discoverNSP.sockets.size && stop) {
        stop()
        stop = undefined
      }
    })
    if (discoverNSP.sockets.size > 0 && stop) return
    stop = userCollection()
      .where('live', '==', true)
      .orderBy('viewers')
      .limit(20)
      .onSnapshot(snap => {
        const data = snap.docs
          .map(d => d.data()!)
          .map(user => ({
            username: user.username,
            viewers: user.viewers,
            live: user.live,
            streamTitle: user.streamTitle,
          }))
        discoverNSP.emit('update', data)
      })
  })
}
