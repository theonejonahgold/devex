import { browser } from '$app/env'
import { getSocketURL } from '$lib/utils/fetch'
import { io } from 'socket.io-client'
import { derived, writable } from 'svelte/store'

export const userToken = writable('')

userToken.subscribe(val => {
  if (browser) {
    const LSToken = localStorage.getItem('user-token')
    if (!LSToken && !val) return
    if (!LSToken && val) return localStorage.setItem('user-token', val)
    if (LSToken && !val) return userToken.set(LSToken)
    if (LSToken !== val) return localStorage.setItem('user-token', val)
  }
})

export const userProfile = derived<
  [typeof userToken],
  | {
      username: string
      viewers: number
      following: string[]
      streamKey: string
      live: boolean
      streamTitle: string
      language: string
    }
  | undefined
>([userToken], ([$userToken], set) => {
  if (!$userToken || !browser) return set(undefined)
  const socket = io(getSocketURL() + '/me', {
    path: '/api/socket.io/',
    auth: {
      token: $userToken,
    },
  })
  socket.on('update', set)
  socket.on('connect_error', () => {
    userToken.set('')
    localStorage.setItem('user-token', '')
  })
  return () => socket.disconnect()
})
