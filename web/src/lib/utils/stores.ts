import type { Writable } from 'svelte/store'

export function toggleBoolStore(store: Writable<boolean>) {
  return () => store.update(val => !val)
}
