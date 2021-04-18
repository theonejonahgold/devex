import type { BlurParams, ScaleParams } from 'svelte/types/runtime/transition'
import { cubicInOut } from 'svelte/easing'

export const blurTransitionConfig: BlurParams = {
  amount: 5,
  duration: 200,
  opacity: 0,
  easing: cubicInOut,
}

export const scaleTransitionConfig: ScaleParams = {
  duration: 200,
  opacity: 0,
  easing: cubicInOut,
}
