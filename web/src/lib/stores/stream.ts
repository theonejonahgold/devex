import type { Level } from 'hls.js'
import { writable } from 'svelte/store'

export let volume = writable(0.5)
export let muted = writable(false)
export let paused = writable(true)
export let fullscreen = writable(false)
export let levels = writable<Level[] | undefined>(undefined)
export let level = writable(-1)
export let autoLevel = writable(0)
export let showOverlay = writable(true)
