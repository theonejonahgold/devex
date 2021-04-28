import { browser } from '$app/env'
import { writable } from 'svelte/store'

export const onboardingDone = writable(true, set => {
  if (!browser) return
  const lsOnboardingDone = localStorage.getItem('onboarding-done')
  if (!lsOnboardingDone) return void set(false)
  set(JSON.parse(lsOnboardingDone))
})

export const profileOnboardingDone = writable(true, set => {
  if (!browser) return
  const lsProfileOnboardingDone = localStorage.getItem(
    'profile-onboarding-done'
  )
  if (!lsProfileOnboardingDone) return void set(false)
  set(JSON.parse(lsProfileOnboardingDone))
})

export const channelOnboardingDone = writable(true, set => {
  if (!browser) return
  const lsChannelOnboardingDone = localStorage.getItem(
    'channel-onboarding-done'
  )
  if (!lsChannelOnboardingDone) return void set(false)
  set(JSON.parse(lsChannelOnboardingDone))
})

if (browser) {
  onboardingDone.subscribe(val =>
    localStorage.setItem('onboarding-done', JSON.stringify(val))
  )
  profileOnboardingDone.subscribe(val =>
    localStorage.setItem('profile-onboarding-done', JSON.stringify(val))
  )
  channelOnboardingDone.subscribe(val =>
    localStorage.setItem('channel-onboarding-done', JSON.stringify(val))
  )
}
