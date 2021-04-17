/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

type ChatMessageType = {
  type: 'chat'
  user: string
  message: string
  hue: number
}

type ServerMessageType = {
  type: 'server'
  message: string
}

type Streamer = {
  username: string
  viewers: number
  live: boolean
  streamTitle: string
}
