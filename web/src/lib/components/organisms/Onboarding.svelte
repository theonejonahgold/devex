<script>
  import { createEventDispatcher } from 'svelte'

  import Modal from '../molecules/Modal.svelte'
  import OnboardingDiscovery from '../molecules/OnboardingDiscovery.svelte'
  import OnboardingIntro from '../molecules/OnboardingIntro.svelte'
  import OnboardingLanguage from '../molecules/OnboardingLanguage.svelte'
  import OnboardingRegister from '../molecules/OnboardingRegister.svelte'

  const dispatch = createEventDispatcher<{
    close: { register: boolean }
  }>()

  let step: 1 | 2 | 3 | 4 = 1
  let titles = ['Hi there!', 'Discovery', 'Languages', 'Register today!']
  $: title = titles[step - 1]

  function next() {
    step += 1
  }

  function previous() {
    step -= 1
  }

  function close(register: boolean) {
    dispatch('close', { register })
  }
</script>

<Modal
  bind:title
  preciseClose
  noClose={step !== 4}
  large
  on:close={() => close(false)}
>
  <slot slot="close">Register later</slot>
  {#if step === 1}
    <OnboardingIntro on:next={next} />
  {:else if step === 2}
    <OnboardingDiscovery on:previous={previous} on:next={next} />
  {:else if step === 3}
    <OnboardingLanguage on:previous={previous} on:next={next} />
  {:else}
    <OnboardingRegister
      on:previous={previous}
      on:register={() => close(true)}
    />
  {/if}
</Modal>
