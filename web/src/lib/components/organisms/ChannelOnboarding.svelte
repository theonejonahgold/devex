<script>
  import { createEventDispatcher } from 'svelte'
  import ChannelOnboardingFollow from '../molecules/ChannelOnboardingFollow.svelte'

  import Modal from '../molecules/Modal.svelte'
  import ChannelOnboardingChat from '../molecules/ChannelOnboardingChat.svelte'
  import ChannelOnboardingIntro from '../molecules/ChannelOnboardingIntro.svelte'

  const dispatch = createEventDispatcher<{
    close: undefined
  }>()

  let step: 1 | 2 | 3 = 1
  let titles = ['Welcome to the stream!', 'Chat', 'Follow']
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
    <ChannelOnboardingIntro on:next={next} on:close={close} />
  {:else if step === 2}
    <ChannelOnboardingChat on:next={next} on:previous={previous} />
  {:else if step === 3}
    <ChannelOnboardingFollow on:close={close} on:previous={previous} />
  {/if}
</Modal>
