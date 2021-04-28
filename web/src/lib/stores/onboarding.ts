import { browser } from '$app/env'
import { writable } from 'svelte/store'

export const onboardingDone = writable(true, set => {
  if (!browser) return
  const lsOnboardingDone = localStorage.getItem('onboarding-done')
  if (!lsOnboardingDone) return void set(false)
  set(JSON.parse(lsOnboardingDone))
})

if (browser)
  onboardingDone.subscribe(val =>
    localStorage.setItem('onboarding-done', JSON.stringify(val))
  )
