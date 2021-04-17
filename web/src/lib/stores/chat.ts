import { readable } from 'svelte/store'

export const hues = readable(
  [0, 38, 67, 92, 135, 184, 239, 257, 301, 336],
  () => {}
)
