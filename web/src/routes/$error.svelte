<script context="module">
  import type { ErrorLoad } from '@sveltejs/kit'

  export const load: ErrorLoad = ({ error, status }) => {
    return {
      props: {
        title: `${status}: ${error.message}`,
      },
    }
  }
</script>

<script>
  import { onboardingDone } from '$lib/stores/onboarding'
  import { onDestroy, onMount } from 'svelte'
  import { get } from 'svelte/store'

  export let title: string
  let onboardingAlreadyDone = get(onboardingDone)

  onMount(() => {
    if (onboardingAlreadyDone) return
    onboardingDone.set(true)
  })
  onDestroy(() => {
    if (onboardingAlreadyDone) return
    onboardingDone.set(false)
  })
</script>

<style>
  div {
    padding: var(--base-space);
  }
</style>

<div>
  <h2>{title}</h2>
</div>
