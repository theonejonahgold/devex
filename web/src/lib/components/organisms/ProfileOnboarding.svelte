<script>
  import { createEventDispatcher } from 'svelte'
  import Modal from '../molecules/Modal.svelte'
  import ProfileOnboardingIntro from '../molecules/ProfileOnboardingIntro.svelte'
  import ProfileOnboardingSettings from '../molecules/ProfileOnboardingSettings.svelte'
  import ProfileOnboardingSetup from '../molecules/ProfileOnboardingSetup.svelte'

  const dispatch = createEventDispatcher<{
    close: undefined
  }>()

  let step: 1 | 2 = 1
  let titles = ['Welcome aboard, captain!', 'Stream settings', 'Stream setup']
  $: title = titles[step - 1]

  function next() {
    step += 1
  }

  function previous() {
    step -= 1
  }

  function close() {
    dispatch('close')
  }
</script>

<Modal bind:title preciseClose large on:close={close}>
  {#if step === 1}
    <ProfileOnboardingIntro on:next={next} on:close={close} />
  {:else if step === 2}
    <ProfileOnboardingSettings on:next={next} on:previous={previous} />
  {:else if step === 3}
    <ProfileOnboardingSetup on:close={close} on:previous={previous} />
  {/if}
</Modal>
